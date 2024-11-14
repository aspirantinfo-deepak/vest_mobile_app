import { useEffect, useState } from "react";
import rocket from "../assets/rocket.svg";
import { useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../services/axiosService";
import useUserStore from "../zustand/userStore";
import { toast } from "react-toastify";

const Intrest = () => {
  const navigate = useNavigate();
  const [news, setnews] = useState<any>([]);
  const [isLoad, setisLoad] = useState(false);
  // const [keyword, setkeyword] = useState<any>("");
  const [search, setsearch] = useState<any>([]);
  const { phone } = useUserStore();
  const [IsModal, setIsModal] = useState(false);
  useEffect(() => {
    getRecentSearch();
  }, []);

  const getRecentSearch = async () => {
    try {
      const response: any = await getRequest("/api/auth/get-user-choices");
      if (response.status == 200) {
        console.log(response.data);
        setnews(response.data.news);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const handleKeyPress = (e: any) => {
  //   if (e.key === "Enter") {
  //     setnews((old: any) => [...old, keyword]);
  //     setkeyword("");
  //   }
  // };
  function getRandomObjects(arr: any, count: any) {
    const shuffledArray = [...arr].sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
  }

  const setSearchData = (e: any) => {
    if (e.target.checked) {
      setsearch((old: any) => [...old, e.target.value]);
    } else {
      setsearch(search.filter((item: any) => item !== e.target.value));
    }
  };
  const saveNews = async () => {
    if (search.length >= 3) {
      try {
        setIsModal(false);
        setisLoad(true);
        const response: any = await postRequest("/api/auth/save-user-choices", {
          phone: phone,
          user_choice_type: "news",
          user_choice: search.toString(),
        });
        if (response.status == 200) {
          navigate("/stock");
          toast.success("News topics saved successfully");
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
        <div className="wrap_head mar-top-30px px-4 text-left">
          <h2 className="shadowtext3 ">Add three or more news topics </h2>
          {/* <input
            type="text"
            value={keyword}
            style={{ paddingLeft: 20 }}
            onChange={(e) => setkeyword(e.target.value)}
            onKeyUp={handleKeyPress}
            className="btn_customes mt-3 mb-3"
            placeholder="Custom (anything you want!)"
          /> */}
          <button
            className="btn_customes mt-3 mb-3"
            onClick={() => {
              const randomObjects = getRandomObjects(news, 3);
              setsearch(randomObjects);
            }}
          >
            Custom (anything you want!)
          </button>
          <div className="text-left mb-7 ">
            {news.map((item: any, key: any) => (
              <>
                <input
                  type="checkbox"
                  value={item}
                  checked={search.includes(item)}
                  id={key + "e1"}
                  className="input_intrest"
                  onChange={(e) => {
                    setSearchData(e);
                  }}
                ></input>
                <label className="lbl_intrest" htmlFor={key + "e1"}>
                  {item}
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
              className="btn_create_account mt-4 p "
            >
              Next step
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

export default Intrest;
