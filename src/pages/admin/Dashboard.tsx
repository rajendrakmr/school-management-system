import React from "react";

const Dashboard: React.FC = () => {
  return <div className="_rkContentBorder row py-2">
    <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
      <div>
        <h4 className="mb-3 mb-md-0">
          Welcome to Attendance Dashboard : Digital HRMS        </h4>
      </div>
    </div>
    <section className="content">
      <div id="flashAttendanceMessage" className="d-none">
        <div
          className="alert alert-danger errorStartWorking"
          style={{ display: "none" }}
        >
          <p className="errorStartWorkingMessage" />
        </div>
        <div
          className="alert alert-danger errorStopWorking"
          style={{ display: "none" }}
        >
          <p className="errorStopWorkingMessage" />
        </div>
        <div
          className="alert alert-success successStartWorking"
          style={{ display: "none" }}
        >
          <p className="successStartWorkingMessage" />
        </div>
        <div
          className="alert alert-success successStopWorking"
          style={{ display: "none" }}
        >
          <p className="successStopWorkingMessage" />
        </div>
      </div>
      <div id="loader" style={{ display: "none" }}>
        <div className="loading">
          <div className="loading-content" />
        </div>
      </div>
      <div className="row">
        <div className="col-xxl-9 col-xl-8 d-flex">
          <div className="row">
            <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">Total Departments</h6>
                  </div>
                  <div className="row align-items-center d-md-flex">
                    <div className="col-lg-6 col-md-6">
                      <h3>3</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-layers link-icon"
                      >
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">Total Employees</h6>
                  </div>
                  <div className="row align-items-center d-md-flex">
                    <div className="col-lg-6 col-md-6">
                      <h3>1</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-users link-icon"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx={9} cy={7} r={4} />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">Total Holidays</h6>
                  </div>
                  <div className="row align-items-center d-md-flex">
                    <div className="col-lg-6 col-md-6">
                      <h3>5</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-umbrella link-icon"
                      >
                        <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">Paid Leaves</h6>
                  </div>
                  <div className="row align-items-center d-md-flex">
                    <div className="col-lg-6 col-md-6">
                      <h3>75</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-file-text link-icon"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1={16} y1={13} x2={8} y2={13} />
                        <line x1={16} y1={17} x2={8} y2={17} />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">On Leave Today</h6>
                  </div>
                  <div className="row align-items-center d-md-flex">
                    <div className="col-lg-6 col-md-6">
                      <h3>0</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-file-minus link-icon"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1={9} y1={15} x2={15} y2={15} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">
                      Pending Leave Requests
                    </h6>
                  </div>
                  <div className="row align-items-center d-md-flex">
                    <div className="col-lg-6 col-md-6">
                      <h3>0</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-twitch link-icon"
                      >
                        <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">
                      Total Check In Today
                    </h6>
                  </div>
                  <div className="row align-items-center d-md-flex">
                    <div className="col-lg-6 col-md-6">
                      <h3>1</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-log-in link-icon"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1={15} y1={12} x2={3} y2={12} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 mb-4 d-flex">
              <div className="card w-100">
                <div className="card-body text-md-start text-center">
                  <div className="d-md-flex justify-content-between align-items-baseline mb-3">
                    <h6 className="card-title mb-2 mb-md-0">
                      Total Check Out Today
                    </h6>
                  </div>
                  <div className="row align-items-center d-md-fle">
                    <div className="col-lg-6 col-md-6">
                      <h3>0</h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end dash-icon mt-md-0 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-log-out link-icon"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1={21} y1={12} x2={9} y2={12} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-4 mb-4 d-flex">
          <div className="card w-100">
            <div className="card-body text-center clock-display">
              <div id="clockContainer" className="mb-2">
                <div id="hour" style={{ transform: "rotate(518deg)" }} />
                <div id="minute" style={{ transform: "rotate(96deg)" }} />
                <div id="second" style={{ transform: "rotate(336deg)" }} />
              </div>
              <p id="date" className="text-primary fw-bolder mb-2">
                {" "}
                Thursday 03/27/2025
              </p>
              <div className="punch-btn mb-2 d-flex align-items-center justify-content-around">
                <button

                  className="btn btn-lg btn-danger"
                  id="stopWorkingBtn"
                  data-audio="https://digitalhr.cyclonenepal.com/assets/audio/beep.mp3"
                >
                  Punch Out
                </button>
              </div>
              <div className="check-text d-flex align-items-center justify-content-around">
                <span>
                  Check In At
                  <p className="text-success fw-bold h5" id="checkInTime">
                    11:01:35{" "}
                  </p>
                </span>
                <span>
                  Check Out At
                  <p className="text-danger fw-bold h5" id="checkOutTime">
                    -:-:-
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  </div>
};

export default Dashboard;