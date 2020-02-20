import { connect } from 'react-redux';
import { compose } from 'redux';
import { setPageChangeStarting, setPageChangeEnding } from '../../redux/actions';
import authService from '../../scripts/AuthService';

const mapStateToProps = (state) => {
	return {
		pageChanging: state.pageChange.pageChanging
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handlePageChangeStart: () => dispatch(setPageChangeStarting),
		handlePageChangeEnd: () => dispatch(setPageChangeEnding)
	};
};

function withPageChange(Component) {
	return class extends Component {
		constructor(props) {
			super(props);
			this.redirectTimer = null;
		}

		componentWillUnmount() {
			const { pageChanging, handlePageChangeEnd } = this.props;
			if (this.redirectTimer) {
				clearTimeout(this.redirectTimer);
			}
			if (pageChanging) {
				handlePageChangeEnd();
			}
		}

		startPageChangeTimer = (path, state, loggingOut) => {
			console.log('this.props', this.props);
			this.props.handlePageChangeStart();
			let historyObj = { pathname: path };
			if (state) historyObj.state = state;
			this.redirectTimer = setTimeout(
				() => this.changePage(historyObj, loggingOut),
				625
			);
		}

		changePage = async (historyObj, loggingOut) => {
			if (loggingOut) await authService.logOut();
			this.props.history.push(historyObj);
		}
	};
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withPageChange);