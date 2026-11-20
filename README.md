# React approval lab

Start in the folder containing package.json. Use Node 22.12+ on the 22.x line or Node 24. Run npm install, then npm run dev. Open the Local URL printed in Terminal. Keep the terminal running as you edit src/App.jsx. The first screen is just a heading.

## How to practise

Keep adding to the same App.jsx. Try each task before opening its matching file in examples. Every example is a complete replacement for src/App.jsx. To run one without losing your work, first save a copy of your App.jsx, then paste the example into it. Refresh resets all edits made through the UI.

## 1 • Approve one request

1. Under the heading, display Reporting access and a Pending status.
2. Import useState and declare status inside App. Render its value in braces.
3. Render an Approve button only when status is Pending. Pass a function to onClick that changes status to Approved.
4. Click it. The status should change immediately and the button should disappear. Refresh to try again.
5. Without the example, add a Reopen button that restores Pending. Explain why changing an ordinary local variable would not refresh the screen.

Checkpoint: examples/01-button.jsx.

## 2 • Approve the correct row

1. Replace the single status with the three sample objects in public/requests.json. For today, copy the data into a constant above App.
2. Store the array in state. Use map to render a RequestRow for each item, keyed by id.
3. Pass request and onApprove into RequestRow as props. The row calls onApprove(request.id); App owns the array.
4. Write approve(id) using a functional setter and map. Return a new object for the matching id and keep the others.
5. Approve the second row first. Verify the first is still Pending. Explain why array position is a poor identifier after a filter changes.

Checkpoint: examples/02-rows.jsx.

## 3 • Filter with a dropdown

1. Add filter state with initial value All. Bind a select to its value and update it on change.
2. Calculate visible from requests and filter. Use visible for rendering.
3. Calculate pendingCount from all requests. Show a message when visible is empty.
4. Choose Approved. The pending count should still be 2 on a fresh page. Choose Pending and approve both rows. Verify the empty message and count of 0.
5. Explain why putting visible in a second state variable creates extra work.

Checkpoint: examples/03-filter.jsx.

## 4 • Add a request

1. Add a form with a labelled input and submit button. Keep the typed name in state.
2. Handle submit on the form so Enter works. Prevent the page reload. Reject blank or whitespace-only input.
3. Create a unique id once on submission and append the new Pending request. Clear the input and switch the filter to All so the user sees the new row.
4. Try submitting spaces, then add a duplicate name. Approve only one of the two. Explain why the name cannot serve as a key.

Checkpoint: examples/04-form.jsx.

## 5 • Load the initial data

1. Start with an empty array. Load /requests.json from public using fetch inside useEffect. The file stands in for a read-only endpoint.
2. Show loading until the data arrives. Handle a failed HTTP response and a rejected promise. Provide Retry.
3. Use an AbortController in cleanup so an obsolete request cannot update the view.
4. Temporarily rename public/requests.json, then reload to see the error. Restore the filename and click Retry. Use browser network throttling to see loading.
5. Add and approve requests after loading. Only the initial read uses the network. Your changes live in component state until refresh. Explain where you would handle a future save request and how you would disable only the row being saved.

Checkpoint: examples/05-fetch.jsx.

## Final 30-minute mock

Start with the heading alone and three local records. In 5 minutes render the rows. By minute 15 approve an individual request. By minute 23 filter by status and show the global pending count. Use the remaining time to test the empty state, explain who owns the data, and handle a follow-up: add a Reset filter button. Try without notes.
