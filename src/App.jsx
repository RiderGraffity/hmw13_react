import { useRef, useState } from "react";
import useWindowSize from "./hooks/useWindowSize";
import useFetch from "./hooks/useFetch";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";
import useClickOutside from "./hooks/useClickOutside";
import useOnlineStatus from "./hooks/useOnlineStatus";
import useInterval from "./hooks/useInterval";
import useForm from "./hooks/useForm";

function validateForm(values) {
  const errs = {};

  if (!values.name.trim()) {
    errs.name = "Введіть імя";
  }

  if (!values.email) {
    errs.email = "Введіть email";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errs.email = "Email некоректний";
  }

  if (values.password.length < 6) {
    errs.password = "Пароль мінімум 6 символів";
  }

  return errs;
}

function App() {
  const { width, height } = useWindowSize();

  const [post_id, setPostId] = useState(1);
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/posts/" + post_id
  );

  const [isDark, toggleDark] = useToggle(false);

  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  const [showPopup, setShowPopup] = useState(false);
  const popup_ref = useRef(null);
  useClickOutside(popup_ref, () => setShowPopup(false));

  const online = useOnlineStatus();

  const [seconds, setSeconds] = useState(0);
  const { stop, resume, running } = useInterval(() => {
    setSeconds((s) => s + 1);
  }, 1000);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } =
    useForm({ name: "", email: "", password: "" }, validateForm);

  const [result, setResult] = useState(null);

  return (
    <div
      style={{
        background: isDark ? "#222" : "#f2f2f2",
        color: isDark ? "white" : "black",
        minHeight: "100vh",
        margin: -20,
        padding: 20,
      }}
    >
      <div className="box" style={{ color: "black" }}>
        <h3>useWindowSize</h3>
        <p>
          Ширина: {width}px, висота: {height}px
        </p>
      </div>

      <div className="box" style={{ color: "black" }}>
        <h3>useFetch</h3>
        <button onClick={() => setPostId((p) => (p > 1 ? p - 1 : 1))}>Назад</button>
        <button onClick={() => setPostId((p) => p + 1)}>Далі</button>
        {loading && <p>Завантаження...</p>}
        {error && <p className="err">{error}</p>}
        {data && !loading && (
          <div>
            <b>
              #{data.id} {data.title}
            </b>
            <p>{data.body}</p>
          </div>
        )}
      </div>

      <div className="box" style={{ color: "black" }}>
        <h3>useToggle</h3>
        <button onClick={toggleDark}>
          Тема: {isDark ? "темна" : "світла"}
        </button>
      </div>

      <div className="box" style={{ color: "black" }}>
        <h3>usePrevious</h3>
        <p>
          Зараз: {count}, раніше: {prevCount === undefined ? "-" : prevCount}
        </p>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(count - 1)}>-1</button>
      </div>

      <div className="box" style={{ color: "black" }}>
        <h3>useClickOutside</h3>
        <button onClick={() => setShowPopup(true)}>Відкрити</button>
        {showPopup && (
          <div className="popup" ref={popup_ref}>
            Клікни десь поза мною
          </div>
        )}
      </div>

      <div className="box" style={{ color: "black" }}>
        <h3>useOnlineStatus</h3>
        <p>{online ? "Ви онлайн" : "Ви офлайн"}</p>
      </div>

      <div className="box" style={{ color: "black" }}>
        <h3>useInterval</h3>
        <p>Секунд: {seconds}</p>
        <button onClick={stop} disabled={!running}>
          Стоп
        </button>
        <button onClick={resume} disabled={running}>
          Продовжити
        </button>
        <button onClick={() => setSeconds(0)}>Скинути</button>
      </div>

      <div className="box" style={{ color: "black" }}>
        <h3>useForm</h3>
        <form onSubmit={handleSubmit((vals) => setResult(vals))}>
          <input
            name="name"
            placeholder="Імя"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name && <div className="err">{errors.name}</div>}

          <input
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && <div className="err">{errors.email}</div>}

          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && (
            <div className="err">{errors.password}</div>
          )}

          <button type="submit">Відправити</button>
          <button
            type="button"
            onClick={() => {
              reset();
              setResult(null);
            }}
          >
            Очистити
          </button>
        </form>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default App;
