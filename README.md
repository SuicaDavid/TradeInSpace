# Solution Explain

This project was built by Next.js, the reason why this framework was selected is that it can integrate server-side code easily. 

## Thought

When I first read this question, I have two ideas about the solution with the time limitation.

1. Autofill the empty row of CSV file and use it as a database.
2. Focus on the searching algorithm

As you see, I chose the second one to concentrate, because the requirement doesn't include editing the CSV file. For that reason, I did not use the first plan. (Fill the CSV file with an empty row which has no event, this method can be easy searched)

My strategy is that use binary search to find out if the input date is occupied. If the date is available, return the result. If not, check the available date before or after the input date.

Due to the time limation of the task, I did not arrange the code and file very well, the time was spent on algorithm.

## Explaination
The frontend design is very simple, just display my skill minimum. I just left a date input with mini date attribute. With some handler to check, upload the input and display the result. I think the task can be improved that asking interviewees to display a table of the slot. 

The server-side code can be improved with Node.js middleware to separate the logic. I change my mind when I start writing, so you can see the api/event/index.js file relative to plan one. I set the Scottish Holiday as a constant and combine it with the events data from the CSV file. All data logic was separated as a file. Next.js has some limitations of server init, so I init the events and holiday when the first request. Then, I use binary search to check the occupied or not. Writing the loop manually instead of array APIs is always faster. If the date was occupied, the server will start to find out the available date before and after. Choosing the date before has risk to reach today, so the day after has higher privilege.

## Improvement
If the time limitation does not exist, I will select the first plan with the TypeScript and Unit test. Then, implement a method to fill and insert all days of the calendar. Also, the holiday of Scotland will be mixed with existing concerts. The conflict will be considered in this situation. With this design, the frontend can receive a table with available slots and not available time.