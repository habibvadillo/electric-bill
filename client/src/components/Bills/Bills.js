import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import axios from "axios";
import config from "../../config";

import "./Bills.css";

function Bills() {
  const [bills, updateBills] = useState();
  const [showingHours, updateShowingHours] = useState();

  useEffect(() => {
    if (!bills) {
      axios
        .get(`${config.API_URL}/api/dates`)
        .then((result) => {
          console.log(result);
          updateBills(result.data);
        })
        .catch((err) => {});
    }
  });

  const showHours = (day) => {
    let newShowingHours = JSON.parse(JSON.stringify(showingHours));
    newShowingHours[day.match(/\d{4}-\d{2}/)[0]][day] =
      !newShowingHours[day.match(/\d{4}-\d{2}/)[0]][day];
    updateShowingHours(newShowingHours);
  };

  let billsDiv = <Loading />;
  if (bills) {
    let months = bills.reduce((acc, elem) => {
      if (!acc.hasOwnProperty(elem.Fecha.match(/\d{4}-\d{2}/)[0])) {
        acc[`${elem.Fecha.match(/\d{4}-\d{2}/)[0]}`] = {};
      }
      acc[`${elem.Fecha.match(/\d{4}-\d{2}/)[0]}`][elem.Fecha] = [];
      return acc;
    }, {});

    if (!showingHours) {
      let tempStateVariable = JSON.parse(JSON.stringify(months));
      for (let month in tempStateVariable) {
        for (let day in tempStateVariable[month]) {
          tempStateVariable[month][day] = false;
        }
      }
      updateShowingHours(tempStateVariable);
    }

    bills.forEach((bill) => {
      months[`${bill.Fecha.match(/\d{4}-\d{2}/)[0]}`][bill.Fecha].push(bill);
    });
    console.log(months);
    billsDiv = (
      <div id="billsDiv">
        {Object.keys(months).map((month) => {
          return (
            <div id="bill" key={month}>
              <h2>{month}</h2>
              <div className="table" id="main-table">
                <div className="table-row">
                  <div className="table-head">Day</div>
                </div>
                {Object.keys(months[month]).map((day, i) => {
                  return (
                    <React.Fragment key={day}>
                      <div className="table-row">
                        <div
                          className="table-cell day"
                          onClick={() => showHours(day)}
                        >
                          {day}
                        </div>
                      </div>
                      {Object.keys(months[month][day]).map((hour) => {
                        console.log(day);
                        return showingHours[day.match(/\d{4}-\d{2}/)[0]][
                          day
                        ] ? (
                          <div className={`table hours`} key={hour}>
                            <div className="table-row">
                              <div className="table-head">Hour</div>
                              <div className="table-head">Consumption</div>
                              <div className="table-head">Price</div>
                              <div className="table-head">Cost per hour</div>
                            </div>
                            <div className="table-row">
                              <div className="table-cell">{hour}</div>
                              <div className="table-cell">
                                {months[month][day][hour]["Consumo (Wh)"]}
                              </div>
                              <div className="table-cell">
                                {months[month][day][hour]["Precio (€/kWh)"]}
                              </div>
                              <div className="table-cell">
                                {months[month][day][hour]["Coste por hora (€)"]}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div>
      <h1>Electricity Bill</h1>
      {billsDiv}
    </div>
  );
}

export default Bills;
