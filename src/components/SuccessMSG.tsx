const SuccessMSG = () => {
  return (
    <div
      className="modal fade modal_picks show"
      style={{ display: "inline-block" }}
    >
      <div className="modal-dialog px-4  modal-dialog-centered ctret2">
        <div className="modal-content modal_pick_con">
          <div className="modal-body p-4">
            <h6 className="selct_heading">Pretty please pick 3 🥹</h6>
            <button className="btn_okfine">Ok fine</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMSG;
