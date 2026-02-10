import "./ConfirmationModel.css";

const ConfirmationModel = ({
    titlemodel,
    descmodel,
    onConfirm,
    onClose,
    confirmBtnText,
}) => {
    return(
        <>
        <div className="model-backdrop">
            <div className="model">
                <h2>{titlemodel}</h2>
                <p>{descmodel}</p>

                <div className="model-actions">
                    <button className="btn3 btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn3 btn-delete" onClick={onConfirm}>{confirmBtnText}</button>

                </div>
            </div>
        </div>
        </>
    )
}
export default ConfirmationModel;