import React from "react"
import { mount } from "enzyme"
import App from "../src/App/App"

it('renders without crashing', () => {
  const subject = mount(<App/>)
});
