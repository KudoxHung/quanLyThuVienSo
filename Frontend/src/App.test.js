import React from "react";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./app/store";
import { render } from "@testing-library/react";

test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
