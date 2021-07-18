import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import axios from "axios";
import config from "../../config";

import "./Bills.css";

function Bills() {
  const [bills, updateBills] = useState();
  const [showingHours, updateShowingHours] = useState();
  const [showingDays, updateShowingDays] = useState();
  const [editting, updateEditting] = useState();

  useEffect(() => {
    if (!bills) {
      axios
        .get(`${config.API_URL}/api/bills`)
        .then((result) => {
          updateBills(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!showingHours && !showingDays && !editting) {
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
      let thirdTempStateVariable = JSON.parse(
        JSON.stringify(tempStateVariable)
      );
      for (let month in thirdTempStateVariable) {
        for (let day in thirdTempStateVariable[month]) {
          for (let i = 0; i < 24; i++) {
            thirdTempStateVariable[month][day].push(false);
          }
        }
      }
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
      updateEditting(thirdTempStateVariable);
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

  const toggleEdit = (months, month, day, hour) => {
    let newEditting = JSON.parse(JSON.stringify(editting));
    newEditting[month][day][+hour] = !newEditting[month][day][hour];
    updateEditting(newEditting);
  };

  const handleEdit = (months, month, day, hour) => {
    let bill = bills.find((bill) => bill.Fecha === day && bill.Hora === hour);
    let id = bill._id;
    axios
      .patch(`${config.API_URL}/api/editbill/${id}`, {
        consumption: bill["Consumo (Wh)"],
        price: bill["Precio (€/kWh)"],
        cost: bill["Coste por hora (€)"],
      })
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });
    toggleEdit(months, month, day, hour);
  };

  const handleChange = (e, months, month, day, hour) => {
    let newBills = JSON.parse(JSON.stringify(bills));
    let index = newBills.findIndex(
      (bill) => bill.Fecha === day && bill.Hora === hour
    );
    let changedBill = newBills[index];
    if (e.target.id === "price") {
      changedBill["Precio (€/kWh)"] = e.target.value;
    }
    if (e.target.id === "consumption") {
      changedBill["Consumo (Wh)"] = e.target.value;
    }
    changedBill["Coste por hora (€)"] = (
      (changedBill["Precio (€/kWh)"] * changedBill["Consumo (Wh)"]) /
      1000
    ).toFixed(12);
    newBills[index] = changedBill;
    updateBills(newBills);
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
    billsDiv = (
      <div id="billsDiv">
        {/* Mapping the months */}
        {Object.keys(months).map((month) => {
          return (
            <div id="bill" key={month}>
              <h2>
                <span onClick={() => showDays(month)}>{month}</span>
              </h2>
              {/* Toggle Days */}
              {showingDays[month] ? (
                <div className="table month">
                  <div className="table-row"></div>
                  {/* Mapping the days */}
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
                          {/* Toggle Hours */}
                          {showingHours[day.match(/\d{4}-\d{2}/)[0]][day] ? (
                            <div className={`table hours`}>
                              <div className="table-row">
                                <div className="table-head">Hour</div>
                                <div className="table-head">
                                  Consumption(Wh)
                                </div>
                                <div className="table-head">Price(€/kWh)</div>
                                <div className="table-head">
                                  Cost per hour(€)
                                </div>
                              </div>
                              {/* Mapping Hours */}
                              {Object.keys(months[month][day]).map((hour) => {
                                return (
                                  <div className="table-row" key={hour}>
                                    <div className="table-cell">{hour}</div>
                                    <div className="table-cell">
                                      {editting[month][day][+hour] ? (
                                        <input
                                          onChange={(e) => {
                                            handleChange(
                                              e,
                                              months,
                                              month,
                                              day,
                                              hour
                                            );
                                          }}
                                          name="consumption"
                                          id="consumption"
                                          type="number"
                                          placeholder={
                                            months[month][day][hour][
                                              "Consumo (Wh)"
                                            ]
                                          }
                                        ></input>
                                      ) : (
                                        months[month][day][hour]["Consumo (Wh)"]
                                      )}
                                    </div>
                                    <div className="table-cell">
                                      {editting[month][day][+hour] ? (
                                        <input
                                          onChange={(e) => {
                                            handleChange(
                                              e,
                                              months,
                                              month,
                                              day,
                                              hour
                                            );
                                          }}
                                          name="price"
                                          id="price"
                                          type="number"
                                          placeholder={
                                            months[month][day][hour][
                                              "Precio (€/kWh)"
                                            ]
                                          }
                                        ></input>
                                      ) : (
                                        months[month][day][hour][
                                          "Precio (€/kWh)"
                                        ]
                                      )}
                                    </div>
                                    <div className="table-cell">
                                      {
                                        months[month][day][hour][
                                          "Coste por hora (€)"
                                        ]
                                      }
                                    </div>
                                    <div className="table-cell" id="edit-cell">
                                      {editting[month][day][+hour] ? (
                                        <strong
                                          onClick={() => {
                                            handleEdit(
                                              months,
                                              month,
                                              day,
                                              hour
                                            );
                                          }}
                                          id="submit"
                                        >
                                          Submit
                                        </strong>
                                      ) : (
                                        <>
                                          <strong
                                            onClick={() => {
                                              toggleEdit(
                                                months,
                                                month,
                                                day,
                                                hour
                                              );
                                            }}
                                            id="edit"
                                          >
                                            Edit
                                          </strong>
                                        </>
                                      )}
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
