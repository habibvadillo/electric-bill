import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import axios from "axios";
import config from "../../config";

import "./Bills.css";

function Bills() {
  const [bills, updateBills] = useState();
  const [showingHours, updateShowingHours] = useState();
  const [showingDays, updateShowingDays] = useState();

  useEffect(() => {
    if (!bills) {
      axios
        .get(`${config.API_URL}/api/dates`)
        .then((result) => {
          console.log(result);
          updateBills(result.data);
        })
        .catch((err) => {});
    } else if (!showingHours && !showingDays) {
      let tempStateVariable = JSON.parse(
        JSON.stringify(
          bills.reduce((acc, elem) => {
            if (!acc.hasOwnProperty(elem.Fecha.match(/\d{4}-\d{2}/)[0])) {
              acc[`${elem.Fecha.match(/\d{4}-\d{2}/)[0]}`] = {};
            }
            acc[`${elem.Fecha.match(/\d{4}-\d{2}/)[0]}`][elem.Fecha] = [];
            return acc;
          }, {})
        )
      );
      let otherTempStateVariable = JSON.parse(
        JSON.stringify(tempStateVariable)
      );
      for (let month in tempStateVariable) {
        for (let day in tempStateVariable[month]) {
          tempStateVariable[month][day] = false;
        }
      }
      for (let month in otherTempStateVariable) {
        otherTempStateVariable[month] = false;
      }
      updateShowingHours(tempStateVariable);
      updateShowingDays(otherTempStateVariable);
    }
  });

  const showHours = (day) => {
    let newShowingHours = JSON.parse(JSON.stringify(showingHours));
    newShowingHours[day.match(/\d{4}-\d{2}/)[0]][day] =
      !newShowingHours[day.match(/\d{4}-\d{2}/)[0]][day];
    updateShowingHours(newShowingHours);
  };

  const showDays = (month) => {
    let newShowingDays = JSON.parse(JSON.stringify(showingDays));
    newShowingDays[month] = !newShowingDays[month];
    updateShowingDays(newShowingDays);
  };

  let billsDiv = <Loading />;
  if (bills && showingHours) {
    let months = bills.reduce((acc, elem) => {
      if (!acc.hasOwnProperty(elem.Fecha.match(/\d{4}-\d{2}/)[0])) {
        acc[`${elem.Fecha.match(/\d{4}-\d{2}/)[0]}`] = {};
      }
      acc[`${elem.Fecha.match(/\d{4}-\d{2}/)[0]}`][elem.Fecha] = [];
      return acc;
    }, {});

    bills.forEach((bill) => {
      months[`${bill.Fecha.match(/\d{4}-\d{2}/)[0]}`][bill.Fecha].push(bill);
    });
    console.log(months);
    billsDiv = (
      <div id="billsDiv">
        {Object.keys(months).map((month) => {
          return (
            <div id="bill" key={month}>
              <h2>
                <span onClick={() => showDays(month)}>{month}</span>
              </h2>
              {showingDays[month] ? (
                <div className="table month">
                  <div className="table-row"></div>
                  {Object.keys(months[month])
                    .sort((a, b) => b.localeCompare(a))
                    .map((day, i) => {
                      return (
                        <React.Fragment key={day}>
                          <div className="table-row">
                            <div className="table-cell day">
                              <strong onClick={() => showHours(day)}>
                                {day}
                              </strong>
                            </div>
                          </div>
                          {showingHours[day.match(/\d{4}-\d{2}/)[0]][day] ? (
                            <div className={`table hours`}>
                              <div className="table-row">
                                <div className="table-head">Hour</div>
                                <div className="table-head">Consumption</div>
                                <div className="table-head">Price</div>
                                <div className="table-head">Cost per hour</div>
                              </div>
                              {Object.keys(months[month][day]).map((hour) => {
                                return (
                                  <div className="table-row" key={hour}>
                                    <div className="table-cell">{hour}</div>
                                    <div className="table-cell">
                                      {months[month][day][hour]["Consumo (Wh)"]}
                                    </div>
                                    <div className="table-cell">
                                      {
                                        months[month][day][hour][
                                          "Precio (€/kWh)"
                                        ]
                                      }
                                    </div>
                                    <div className="table-cell">
                                      {
                                        months[month][day][hour][
                                          "Coste por hora (€)"
                                        ]
                                      }
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </React.Fragment>
                      );
                    })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div>
      <h1>Electric Bill</h1>
      {billsDiv}
    </div>
  );
}

export default Bills;
