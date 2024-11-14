import rocket from "../assets/rocket.svg";
import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../services/axiosService";
import useUserStore from "../zustand/userStore";
import { toast } from "react-toastify";

const Stock = () => {
  const [news, setnews] = useState<any>([]);
  const [keyword, setkeyword] = useState<any>("");
  const [search, setsearch] = useState<any>([]);
  const { phone } = useUserStore();
  const [isLoad, setisLoad] = useState(false);
  const [IsModal, setIsModal] = useState(false);
  useEffect(() => {
    getRecentSearch();
  }, []);

  const getRecentSearch = async () => {
    try {
      const response: any = await getRequest("/api/auth/get-user-choices");
      if (response.status == 200) {
        setnews(response.data.stocks);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setnews((old: any) => [...old, { name: keyword, symbol: keyword }]);
      setkeyword("");
    }
  };
  const setSearchData = (e: any, item1: any) => {
    if (e.target.checked) {
      setsearch((old: any) => [...old, item1]);
    } else {
      setsearch(search.filter((item: any) => item.symbol !== item1.symbol));
    }
  };
  const saveNews = async () => {
    if (search.length >= 3) {
      try {
        setisLoad(true);
        setIsModal(false);
        const response: any = await postRequest("/api/auth/save-user-choices", {
          phone: phone,
          user_choice_type: "stock",
          user_choice: search,
        });
        if (response.status == 200) {
          // navigate("/enter-password", { replace: true });
          toast.success("Stocks saved successfully");
          window.location.reload();
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.response.data);
      } finally {
        setisLoad(false);
      }
    } else {
      setIsModal(true);
    }
  };
  return (
    <>
      <div className="log_wrapper headspace">
        <div className="wrap_head px-4 text-left mar-top-30px">
          <h2 className="shadowtext3 ">Add three or more stocks</h2>
          <input
            type="text"
            value={keyword}
            style={{ paddingLeft: 20 }}
            onChange={(e) => setkeyword(e.target.value)}
            onKeyUp={handleKeyPress}
            className="btn_customes mt-3 mb-3"
            placeholder="Search"
          />

          <div className="text-left mb-7">
            {news.map((item: any, key: any) => (
              <>
                <input
                  type="checkbox"
                  value={item}
                  id={key + "e1"}
                  className="input_intrest"
                  onChange={(e) => {
                    setSearchData(e, item);
                  }}
                ></input>
                <label className="lbl_intrest" htmlFor={key + "e1"}>
                  {item.name} ({item.symbol})
                </label>
              </>
            ))}
          </div>

          <div className="fix-posti-btns">
            <button
              type="button"
              disabled={isLoad}
              onClick={() => {
                saveNews();
              }}
              className="btn_create_account  mt-4 p "
            >
              Let's go!
            </button>
          </div>
        </div>
        <img src={rocket} className="img_opacity"></img>
      </div>
      {IsModal && (
        <div
          className="modal fade modal_picks show"
          style={{ display: "inline-block" }}
        >
          <div className="modal-dialog px-4  modal-dialog-centered ctret2">
            <div className="modal-content modal_pick_con">
              <div className="modal-body p-4">
                <h6 className="selct_heading">Pretty please pick 3 🥹</h6>
                <button
                  className="btn_okfine"
                  onClick={() => setIsModal(false)}
                >
                  Ok fine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stock;
