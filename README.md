# Identity Verification

This repository contains the frontend code for the prebuilt web pages used in the Identity Verification module, which is deployed at https://cams.ultrapass.id/. Additionally, we provide sample React.js and Node.js/Express code that can be used to call the prebuilt web pages in this repository and perform identity verification.

## Code examples

### Frontend

```javascript
function IdentityVerificationButton(){
const handleVerify = ()=>{
await fetch("https://my-server.com/session", {method:"POST"})
}
return(
<button onClick={handleVerify}>Verify your identity</button>
)
}
```

### Backend

```
import express from "express";
import { createVerificationSession } from "@privateid/cryptonets-web-sdk";
const app = express();
const PORT = process.env.PORT


app.post("/session", (req, res) => {
  const result = await createVerificationSession({
    //(The URL to redirect to on success),
    successUrl: "https://www.success.com",
    // (The URL to redirect to on failure),
    failureUrl: "https://www.failure.com",
    // The type of session to create. Can be "IDENTITY" or "AGE"
    type: "IDENTITY",
    //(This is the API value for the product group associated with this session)
    productGroupId: "process.env.MY_PRODUCT_GROUP_ID",
  });
  //result will be an object with the following structure {
  // url:”https://cams.ultrapass.id?token=1223”
  // }

  res.redirect(result.url);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
