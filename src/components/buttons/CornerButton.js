import PrimaryButton from './PrimaryButton';

class CornerButton extends PrimaryButton {
	constructor(props) {
		super(props);
		this.addClassNames(['corner-button']);
	}
}

export default CornerButton;