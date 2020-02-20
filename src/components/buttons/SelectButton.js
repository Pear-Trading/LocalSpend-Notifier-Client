import PrimaryButton from './PrimaryButton';

class SelectButton extends PrimaryButton {
	constructor(props) {
		super(props);
		this.defaultVariant = this.variant;
	}

	render() {
		if (this.props.selected) {
			this.variant = 'danger';
		} else {
			this.variant = this.defaultVariant;
		}
		return super.render();
	}
}

export default SelectButton;