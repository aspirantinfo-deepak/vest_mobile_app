const PortfolioSearch = () => {
  return (
    <div className="container" style={{ padding: 24 }}>
      <div className="row">
        <div className="col-12 border-bottom1 px-0 pb-3">
          <input
            type="search"
            className="popup_search"
            placeholder="Search markets"
          ></input>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-3 popup_buttons px-0">
          <button className="active">Stocks</button>
          <button>Indexes</button>
          <button>Crypto</button>
        </div>
      </div>
      <div className="row pt-2">
        <div className="col-12 px-0 pt-3">
          <h3 className="pop_heading_2 mb-0">Market cap</h3>
        </div>
      </div>
      <div
        className="row py-3 border-bottom1"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal3"
      >
        <div className="col-8 px-0">
          <p className="company_name">Robinhood Markets LLC</p>
          <p className="stockname">HOOD</p>
        </div>
        <div className="col-4 text-right">
          <p className="company_name">$111.42</p>
          <p className="uptrend">
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
              className="feather feather-arrow-up"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            1.65%
          </p>
        </div>
      </div>
      <div
        className="row py-3 border-bottom1"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop3"
      >
        <div className="col-8 px-0">
          <p className="company_name">Apple Computers</p>
          <p className="stockname">AAPL</p>
        </div>
        <div className="col-4 text-right">
          <p className="company_name">$111.42</p>
          <p className="uptrend">
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
              className="feather feather-arrow-up"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            &nbsp; 1.65%
          </p>
        </div>
      </div>
      <div
        className="row py-3 border-bottom1"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop3"
      >
        <div className="col-8 px-0">
          <p className="company_name">Apple Computers</p>
          <p className="stockname">AAPL</p>
        </div>
        <div className="col-4 text-right">
          <p className="company_name">$111.42</p>
          <p className="uptrend">
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
              className="feather feather-arrow-up"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            &nbsp; 1.65%
          </p>
        </div>
      </div>
      <div
        className="row py-3 "
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop3"
      >
        <div className="col-8 px-0">
          <p className="company_name">Alphabet Class A</p>
          <p className="stockname">GOOG</p>
        </div>
        <div className="col-4 text-right">
          <p className="company_name">$111.42</p>
          <p className="uptrend">
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
              className="feather feather-arrow-up"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            &nbsp; 1.65%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSearch;
