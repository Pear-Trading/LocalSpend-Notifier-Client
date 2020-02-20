import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './withAnimations.css';

function withAnimations(Component) {
	return class extends Component {
		constructor(props) {
			super(props);
			this.state = {
				...this.state,
				show: false,
				enterAnimationStarted: false,
				enterAnimationComplete: false
			};
			this.loaded = false;
			window.store.subscribe(this.handleStateChange);
			this.pageChanging = false;
		}

		componentDidMount() {
			if (this.state.loading === undefined) {
				this.setState({ show: true });
			}
			if (super.componentDidMount) super.componentDidMount();
		}

		componentDidUpdate() {
			const { loading, show } = this.state;
			if (!this.loaded && !loading) {
				if (!show) this.setState({ show: true });
				this.loaded = true;
			}/* else if ((this.props.redirecting || this.state.redirecting) && show) {
				this.setState({ show: false });
			}*/
			if (super.componentDidUpdate) super.componentDidUpdate();
		}

		handleStateChange = () => {
			console.log('handleStateChange A');
			const prevPageChanging = this.pageChanging;
			this.pageChanging = window.store.getState().pageChange.pageChanging;
			if (this.pageChanging !== prevPageChanging && this.state.show) {
				console.log('handleStateChange B');
				this.setState({ show: false });
			}
		}

		handleEnterAnimationStarted = () => {
			this.setState({ enterAnimationStarted: true });
		}

		handleEnterAnimationCompleted = () => {
			this.setState({ enterAnimationComplete: true });
		}

		render() {
			/*console.log('state', this.state);
			if (this.state.loading) {
				console.log('loading');
				return (
					<div className="full-height d-flex flex-centre-xy">
						<LoadingMessage />
					</div>
				);
			}*/

			return (
				<CSSTransition
					component="div"
					in={this.state.show}
					classNames="fade"
					timeout={750}
					onEntering={this.handleEnterAnimationStarted}
					onEntered={this.handleEnterAnimationCompleted}
					mountOnEnter
				>
					{super.render()}
				</CSSTransition>
			);
		}
	};
}

export default withAnimations;