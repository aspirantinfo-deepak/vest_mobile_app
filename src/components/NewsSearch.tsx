import { useEffect, useRef, useState } from "react";
import { postRequest } from "../services/axiosService";
import FullScreenLoader from "./FullScreenLoader";
// import { toast } from "react-toastify";
// import n1 from "../assets/n1.png";
// import n2 from "../assets/n2.png";
const NewsSearch = (props: any) => {
  const [newsList, setnewsList] = useState<any>([]);
  const [topics, settopics] = useState<any>([]);
  const [duration, setduration] = useState<any>([]);
  const [keyword, setkeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [newsDetails, setnewsDetails] = useState<any>("");
  const [isSaved, setisSaved] = useState(false);
  const [showSearchButton, setshowSearchButton] = useState(false);
  const inputRef = useRef<any>(null);
  const [removeNewsID, setremoveNewsID] = useState<any>("");
  useEffect(() => {
    setisSaved(false);
    setshowSearchButton(false);
    getNews();
    if (props.newsDetails) {
      console.log(props.newsDetails);
      // setshowSearchButton(true);
      setisSaved(true);
      setremoveNewsID(props.newsDetails._id);
      setkeyword(props.newsDetails.keyword);
      const arr = props.newsDetails.topics.split(",");
      settopics(arr);

      setnewsDetails({
        news_id: props.newsDetails._id,
        description: props.newsDetails.description,
        title: props.newsDetails.title,
      });
      if (props.newsDetails.duration) {
        const arr2 = props.newsDetails.duration.split(",");
        setduration(arr2);
      }
    }
    // inputRef.current.focus();
  }, []);

  const getNews = async () => {
    try {
      const response = await postRequest<any>("/api/app/news/list", {
        page: "1",
        size: "100",
      });
      if (response.status == 200) {
        // console.log(response.data);
        setnewsList(response.data.data);
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
    }
  };
  const searchNews = async () => {
    if (keyword) {
      //   if (duration.length > 0) {
      setshowSearchButton(false);
      try {
        setIsLoading(true);
        const response = await postRequest<any>("/api/app/news/search", {
          keyword: keyword,
          topics: topics.toString(),
          duration: duration.toString(),
        });
        setIsLoading(false);
        if (response.status == 200) {
          console.log(response.data);
          setnewsDetails(response.data.data);
          setshowSearchButton(true);
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error("Error creating user:", error);
      }
      // } else {
      //   toast.error("Please select duration");
      // }
    } else {
      // toast.error("Please enter keyword.");
    }
  };
  const updateTopic = (e: any, data: any) => {
    if (e.target.checked) {
      settopics((old: any) => [...old, data]);
    } else {
      settopics(topics.filter((item: any) => item !== data));
    }
  };
  const updateDuration = (e: any, data: any) => {
    if (e.target.checked) {
      setduration((old: any) => [...old, data]);
    } else {
      setduration(duration.filter((item: any) => item !== data));
    }
  };
  const addNews = async (news_id: any, action: any) => {
    try {
      setIsLoading(true);
      const response = await postRequest<any>("/api/app/news/save", {
        news_id: news_id,
        action: action,
      });
      if (response.status == 200) {
        setIsLoading(false);
        console.log(response.data);
        if (response.data.status == 1) {
          setisSaved(true);
          localStorage.setItem("newsChanges", JSON.stringify(true));
          if (action == "save") {
            setremoveNewsID(response.data.data.news_id);
          } else {
            setremoveNewsID("");
            setisSaved(false);
          }
        } else {
          // toast.error(response.data.message);
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      searchNews();
    }
  };
  return (
    <div className="container" style={{ padding: 24 }}>
      <FullScreenLoader
        isLoading={isLoading}
        message="Searching the world for your news"
      />
      {newsDetails && (
        <div className="row">
          <div className="col-12 pt-2 px-0">
            <button
              onClick={() => {
                setnewsDetails("");
                setkeyword("");
                settopics([]);
                setduration([]);
                getNews();
                setshowSearchButton(false);
                setisSaved(false);
              }}
              className="back-btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              &nbsp;Back
            </button>
          </div>
        </div>
      )}
      <div className="row border-bottom1 pt-3 pb-3 mt-2">
        <div className="col-12 px-0 position-relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setkeyword(e.target.value);
              setshowSearchButton(false);
            }}
            onKeyUp={handleKeyPress}
            placeholder="Search news"
            ref={inputRef}
            className="popup_search"
          ></input>
        </div>
      </div>
      <div className="row pt-4">
        <div className="col-12 px-0">
          <input
            type="checkbox"
            checked={topics.includes("Quick")}
            id="one1"
            onChange={(e) => updateTopic(e, "Quick")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="one1">Quick</label>
          <input
            type="checkbox"
            id="two1"
            checked={topics.includes("Detailed")}
            onChange={(e) => updateTopic(e, "Detailed")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="two1">Detailed</label>
          <input
            type="checkbox"
            checked={topics.includes("Creative")}
            id="three1"
            onChange={(e) => updateTopic(e, "Creative")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="three1">Creative</label>
          <input
            type="checkbox"
            id="four1"
            checked={topics.includes("Finance sources")}
            onChange={(e) => updateTopic(e, "Finance sources")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="four1">Finance sources</label>
          <br />
          <input
            type="checkbox"
            id="five1"
            checked={duration.includes("Major sources")}
            onChange={(e) => updateDuration(e, "Major sources")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="five1">Major sources</label>
          <input
            type="checkbox"
            id="six1"
            checked={duration.includes("Today")}
            onChange={(e) => updateDuration(e, "Today")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="six1">Today</label>
          <input
            type="checkbox"
            id="seven1"
            checked={duration.includes("This week")}
            onChange={(e) => updateDuration(e, "This week")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="seven1">This week</label>
          <input
            checked={duration.includes("Image")}
            type="checkbox"
            id="eight1"
            onChange={(e) => updateDuration(e, "Image")}
            className="checkbox_lbl"
          ></input>
          <label htmlFor="eight1">Image</label>
        </div>

        <div className="col-12 px-0 pt-2">
          {/* showSearchButton */}
          {!showSearchButton && (
            <button
              disabled={isLoading}
              className="refreshnwsfed"
              style={
                keyword ? { backgroundColor: "#00FF00", color: "black" } : {}
              }
              onClick={searchNews}
            >
              {isLoading && (
                <>
                  <svg viewBox="25 25 50 50" className="ldrsvg">
                    <circle className="cir" r="20" cy="50" cx="50"></circle>
                  </svg>
                  &nbsp; Searching...
                </>
              )}
              {!isLoading && "Search"}
            </button>
          )}
          {showSearchButton && isSaved && (
            <button
              className="save unsave"
              onClick={() => addNews(removeNewsID, "unsave")}
            >
              Unsave
            </button>
          )}
          {showSearchButton && !isSaved && (
            <button
              onClick={() => addNews(newsDetails.news_id, "save")}
              className="save saved"
              style={{ backgroundColor: "#00FF00", color: "black" }}
            >
              Save
            </button>
          )}
          &nbsp;&nbsp;
          {showSearchButton && (
            <button onClick={searchNews} className="refreshnwsfed">
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* <div className="row pt-2">
        <div className="col-12 px-0 pt-3 pb-1 whi_space_nowr d-flex">
          <div className="card_news_head">
            <div className="news_imgss">
              <img src={n1}></img>
              <div className="px-3 pt-1">
                <h3 className="nesw_headliness_ex">We are going to the moon</h3>
              </div>
            </div>

            <div className="card_nesw_footer px-3">
              <p className="m-0">Yahoo Finance</p>
              <p className="mx-0">Today</p>
            </div>
          </div>

          <div className="card_news_head">
            <div className="news_imgss">
              <img src={n2}></img>
              <div className="px-3 pt-1">
                <h3 className="nesw_headliness_ex">
                  Barron Trump Convinces Donals to Leave the Middle East
                </h3>
              </div>
            </div>

            <div className="card_nesw_footer px-3">
              <p className="m-0">Yahoo Finance</p>
              <p className="mx-0">Today</p>
            </div>
          </div>

          <div className="card_news_head">
            <div className="news_imgss">
              <img src={n1}></img>
              <div className="px-3 pt-1">
                <h3 className="nesw_headliness_ex">We are going to the moon</h3>
              </div>
            </div>

            <div className="card_nesw_footer px-3">
              <p className="m-0">Yahoo Finance</p>
              <p className="mx-0">Today</p>
            </div>
          </div>
        </div>
      </div> */}

      {!newsDetails && (
        <div className="row">
          <div className="col-12 pt-4 pb-1 px-0">
            <p className="heading2 cliwhit mb-0">Recent searched</p>
          </div>
        </div>
      )}

      {!newsDetails && (
        <div className="row ">
          {newsList.length > 0 &&
            newsList.map((item: any, key: any) => (
              <div
                className="col-12 border-bottom1 px-0  news_blocks_ser mb-1"
                key={key}
                onClick={() => {
                  setkeyword(item.keyword);
                  const arr = item.topics.split(",");
                  settopics(arr);
                  setnewsDetails({
                    news_id: item._id,
                    description: item.description,
                    title: item.title,
                  });
                  if (props.newsDetails.duration) {
                    const arr2 = props.newsDetails.duration.split(",");
                    setduration(arr2);
                  }
                }}
              >
                <h6 className="pt-3" style={{ textTransform: "capitalize" }}>
                  {item.title}
                </h6>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      item.description.length > 80
                        ? item.description.replace("<br>", " ").slice(0, 80) +
                          "..."
                        : item.description.split("\n").join("<br/>"),
                  }}
                ></p>
              </div>
            ))}
        </div>
      )}
      {newsDetails && (
        <div className="row">
          <div className="col-12 pb-2 pt-4 px-0">
            <p className="heading2 mb-0">News update</p>
          </div>
        </div>
      )}
      {newsDetails && (
        <div className="row mb-5">
          <div className="col-12 news_searchss px-0">
            <p
              dangerouslySetInnerHTML={{
                __html: newsDetails?.description.split("\n").join("<br/>"),
              }}
            ></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsSearch;
