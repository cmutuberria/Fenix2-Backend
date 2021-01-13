import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { change_language, loadLang } from "../Redux/Actions/lang";
import { langSelected } from "../Redux/selectors";
import Es from '../I18N/es.json';
import En from '../I18N/en.json';
export default ({ children }) => {
  const dispatch = useDispatch();
  const langLocalStorage = localStorage.getItem("lang");
  const langSelected1 = useSelector((state) => langSelected(state));
  const [message, setMessage] = useState(Es);

  useEffect(() => {
    if (langLocalStorage) {
      dispatch(loadLang(langLocalStorage));
    } else {
      dispatch(change_language(navigator.language.substr(0, 2)));
    }
  }, []);

  useEffect(() => {
    switch (langSelected1) {
      case "es":
        // import("../I18N/es.json").then((obj) => setMessage(obj));
        setMessage(Es)
        return;
      case "en":
        // import("../I18N/en.json").then((obj) => setMessage(obj));
        setMessage(En)
        return;
      default:
        // import("../I18N/es.json").then((obj) => setMessage(obj));
        setMessage(Es)
        return;
    }
  }, [langSelected1]);

  return (
    <IntlProvider messages={message} locale={langSelected1} >
      {children}
    </IntlProvider>
  );
};
