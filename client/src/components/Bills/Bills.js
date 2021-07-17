import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import axios from "axios";
import config from "../../config";

function Bills() {
  const [bills, updateBills] = useState();

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

  let dates = [];
  let months = [];

  let billsDiv = <Loading />;
  if (bills) {
    bills.forEach((bill) => {
      if (!dates.includes(bill.Fecha)) {
        dates.push(bill.Fecha);
      }
    });
    dates.forEach((date) => {
      if (!months.includes(date.match(/\d{4}-\d{2}/)[0])) {
        months.push(date.match(/\d{4}-\d{2}/)[0]);
      }
    });
    dates.sort((a, b) => a.localeCompare(b));
    console.log(months);
    billsDiv = (
      <div id="billsDiv">
        {months.map((month) => {
          return (
            <div id="bill" key={month}>
              <h2>{month}</h2>
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
