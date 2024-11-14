import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
declare const window: any;
const ModalComponent = () => {
  const [touchStartY, setTouchStartY] = useState(0);

  useEffect(() => {
    const modalElement = document.getElementById("myModal");

    // Handle touch start
    const handleTouchStart = (event: any) => {
      if (event.changedTouches && event.changedTouches.length > 0) {
        setTouchStartY(event.changedTouches[0].screenY);
      }
    };

    // Handle touch end and swipe detection
    const handleTouchEnd = (event: any) => {
      if (event.changedTouches && event.changedTouches.length > 0) {
        const touchEndY = event.changedTouches[0].screenY;
        const swipeDistance = touchEndY - touchStartY;
        if (swipeDistance > 50) {
          // Programmatically close the modal using Bootstrap 5's Modal API
          const modalInstance = new window.bootstrap.Modal(modalElement);
          modalInstance.hide();
        }
      }
    };

    if (modalElement) {
      modalElement.addEventListener("touchstart", handleTouchStart);
      modalElement.addEventListener("touchend", handleTouchEnd);
    }

    // Cleanup event listeners on unmount
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("touchstart", handleTouchStart);
        modalElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [touchStartY]);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#myModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="myModal"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal Title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h1>hjgkjgjkhj</h1>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalComponent;
