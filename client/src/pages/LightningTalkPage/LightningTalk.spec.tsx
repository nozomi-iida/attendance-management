import { render } from "@testing-library/react";
import { LightningTalk } from "pages/LightningTalkPage/LightningTalk";
import { customRender } from "helpers/specHelpers";
import { setupServer } from "msw/node";
import { mockAccount } from "api/account";
import { createMemoryHistory } from "history";

const server = setupServer();
const history = createMemoryHistory();

describe("LightningTalk", () => {
  it.skip("Create LightningTalk", () => {
    customRender(<LightningTalk />, {
      server,
      account: mockAccount(),
      history,
    });
  });
  it.skip("Update LightningTalk", () => {
    customRender(<LightningTalk />, {
      server,
      account: mockAccount(),
      history,
    });
  });
  it.skip("delete LightningTalk", () => {
    customRender(<LightningTalk />, {
      server,
      account: mockAccount(),
      history,
    });
  });
});
