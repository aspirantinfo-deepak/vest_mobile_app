const SearchNews = () => {
  return (
    <>
      <div className="container ">
        <div className="row">
          <div className="col-12 pt-2">
            <button className="back-btn">
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
        <div className="row border-bottom py-3 mt-2">
          <div className="col-6 pt-1">
            <h2 className="news_heads mb-0">Israel</h2>
          </div>
          <div className="col-6 text-right ">
            <button className="btn_save_news">Add</button>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-12">
            <input type="checkbox" id="one" className="checkbox_lbl"></input>
            <label htmlFor="one">Quick</label>
            <input type="checkbox" id="two" className="checkbox_lbl"></input>
            <label htmlFor="two">Detailed</label>
            <input type="checkbox" id="three" className="checkbox_lbl"></input>
            <label htmlFor="three">Creative</label>
            <input type="checkbox" id="four" className="checkbox_lbl"></input>
            <label htmlFor="four">Finance sources</label>
            <input type="checkbox" id="five" className="checkbox_lbl"></input>
            <label htmlFor="five">Major sources</label>
            <input type="checkbox" id="six" className="checkbox_lbl"></input>
            <label htmlFor="six">Today</label>
            <input type="checkbox" id="seven" className="checkbox_lbl"></input>
            <label htmlFor="seven">This week</label>
            <input type="checkbox" id="eight" className="checkbox_lbl"></input>
            <label htmlFor="eight">Image</label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 py-3">
            <p className="heading2 mb-0">Sources</p>
          </div>
          <div className="col-12 over-scrol">
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 pb-2 pt-4">
            <p className="heading2 mb-0">News update</p>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-12 news_searchss">
            <p>Escalation on Multiple Fronts: Israel's 24-Hour Whirlwind</p>

            <span>
              Israel finds itself at the center of a rapidly evolving conflict,
              with tensions escalating on multiple fronts. From devastating
              airstrikes to diplomatic maneuvering, here's a creative summary of
              the past 24 hours in Israel's tumultuous landscape.
            </span>

            <p>Gaza Under Fire: Refugee Camps Become Battlegrounds</p>

            <span>
              Israeli airstrikes pounded central and northern Gaza, claiming at
              least 18 lives, including five children and two women. The strikes
              targeted refugee camps, turning shelters into scenes of
              devastation. In the Jabaliya camp, a family home was reduced to
              rubble, with rescuers desperately searching for survivors amidst
              the chaos
            </span>

            <p>Lebanon's Fiery Border: A Dangerous Dance with Hezbollah</p>

            <span>
              The Israel-Lebanon border has become a hotbed of activity.
              Hezbollah fighters launched artillery shells and rockets at
              Israeli troops near the border village of Labbouneh. In a bold
              move, Israeli forces planted their flag on the outskirts of a
              Lebanese border village, a symbolic act of defiance in this
              high-stakes territorial tango
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchNews;
