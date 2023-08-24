import { useState, useEffect } from "react";
import "./assets/css/index.css";

import Datepicker from "react-tailwindcss-datepicker";

import { formatDate } from "@/utils";

import ic_edit from "@/assets/images/ic_edit.svg";
import ic_delete from "@/assets/images/ic_delete.svg";

const Input = ({ title = "", type = "text", value, setValue, disabled = false }) => {
  return (
    <div className="w-full">
      <p>{title}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="form-control p-2 border-[1px]"
        disabled={disabled}
      />
    </div>
  );
};

const InputDate = ({ title = "", value, setValue, disabled = false }) => {
  return (
    <div className="w-full">
      <p>{title}</p>
      <Datepicker
        i18n="es"
        asSingle={true}
        useRange={false}
        value={value}
        onChange={setValue}
        displayFormat="DD/MM/YYYY"
        inputClassName="bg-white form-control"
        disabled={disabled}
        startFrom={new Date()}
      />
    </div>
  );
};

const ButtonPlus = () => {
  return (
    <button type="submit" className="btn btn-primary mt-6 h-10" style={{ minWidth: 40 }}>
      +
    </button>
  );
};

function App() {
  const [income, setIncome] = useState(0);
  const [expenditure, setExpenditure] = useState(0);
  const [concepts, setConcepts] = useState("");
  const [dividends, setDividends] = useState(0);
  const [calcToday, setCalcToday] = useState(0);
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  const [data, setData] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const aux = [...data];

    const dateAux = new Date(date.startDate);
    dateAux.setHours(24, 0, 0, 0);

    const obj = {
      date: dateAux,
      income,
      expenditure,
      calcToday,
      dividends,
      concepts,
    };

    aux.push(obj);
    setData(aux);

    setIncome(0);
    setExpenditure(0);
    setConcepts("");
    setDividends(0);
    setCalcToday(0);
    setDate({
      startDate: null,
      endDate: null,
    });
  };

  const subtractDates = (newValue) => {
    setDate(newValue);
    const today = new Date();
    const timeDifference = new Date(newValue.startDate).getTime() - today.getTime();
    const daysDifference = Math.abs(Math.ceil(timeDifference / (1000 * 3600 * 24))) - 1;
    setCalcToday(daysDifference);
  };

  useEffect(() => {
    if (income && calcToday) {
      const res = (0.09 / 360) * parseFloat(calcToday) * parseFloat(income);
      setDividends(res);
    }
  }, [income, calcToday]);

  return (
    <div className="mx-10">
      <form onSubmit={handleSubmit} className="mt-10 flex gap-3">
        <InputDate title="Fecha" value={date} setValue={subtractDates} />
        <Input title="Ingreso" type="number" value={income} setValue={setIncome} />
        <Input title="Egreso" type="number" value={expenditure} setValue={setExpenditure} />

        <Input title={`${formatDate(new Date())}`} value={calcToday} disabled />
        <Input title="Dividendos" value={dividends.toFixed(2)} disabled />
        <Input title="Conceptos" value={concepts} setValue={setConcepts} />

        <ButtonPlus />
      </form>
      <table className="table table-report overflow-auto mt-10">
        <thead className="table-light">
          <tr>
            <th className="whitespace-nowrap">Fecha</th>
            <th className="whitespace-nowrap">Ingreso</th>
            <th className="whitespace-nowrap">Egreso</th>
            <th className="whitespace-nowrap">{formatDate(new Date())}</th>
            <th className="whitespace-nowrap">Dividendos</th>
            <th className="whitespace-nowrap">Conceptos</th>
            <th className="whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, index) => (
              <tr key={`data-${index}`}>
                <td>{formatDate(item.date)}</td>
                <td>{item.income}</td>
                <td>{item.expenditure}</td>
                <td>{item.calcToday}</td>
                <td>{item.dividends.toFixed(2)}</td>
                <td>{item.concepts}</td>
                <td className="flex gap-3">
                  <img alt="" src={ic_edit} />
                  <img alt="" src={ic_delete} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
