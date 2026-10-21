# E1: Income and Expense Tracking
Users can record and manage the money coming in and going out each month.

## US1: Add an Expense
As a user, I want to add an expense with an amount, category, date, and location so that I can see where my money goes.
FR: FR1
Priority: Must
MVP: yes
- [ ] The user can open an "Add Expense" form from the main page.
- [ ] The form requires an amount and a category; date and location are optional, and the date defaults to today.
- [ ] An amount that is not a positive number is rejected, and the user sees an error message.
- [ ] After the user clicks "Confirm," the expense appears in the expense list.
- [ ] Monthly totals and the remaining budget update immediately and are 100% accurate.
## US2: Edit an Expense
As a user, I want to edit an expense I already entered so that I can fix mistakes.
FR: FR4
Priority: Must
MVP: yes
- [ ] Each expense in the list has an "Edit" option.
- [ ] The edit form is pre-filled with the current amount, category, date, and location.
- [ ] The same validation rules as adding an expense apply.
- [ ] Saving updates the entry and recalculates all totals accurately.
- [ ] Canceling leaves the original expense unchanged.
## US3: Delete an Expense
As a user, I want to delete an expense so that entries I don't need don't throw off my totals.
FR: FR6
Priority: Must
MVP: yes
- [ ] Each expense in the list has a "Delete" option.
- [ ] The user is asked to confirm before the expense is removed.
- [ ] After deletion, the expense no longer appears in the list.
- [ ] Totals and the remaining budget recalculate accurately.
## US4: Add an income stream
As a user with more than one job, I want to add each income source separately so that I know exactly how much I'm making.
FR: FR2
Priority: Must
MVP: yes
- [ ] The user can enter a name, an amount, and a frequency (weekly, biweekly, or monthly).
- [ ] An amount that is not a positive number is rejected, and the user sees an error message.
- [ ] Income is converted to a monthly total based on its frequency.
- [ ] The new income stream appears in the income list, and total monthly income updates.
## US5: Edit an income stream
As a user, I want to update an income stream when my pay changes so that my totals stay correct.
FR: FR3
Priority: Must
MVP: yes
- [ ] Each income stream has an "Edit" option with its current values pre-filled.
- [ ] The user can change the name, amount, or frequency.
- [ ] Saving updates the stream and recalculates total monthly income accurately.
- [ ] Canceling leaves the income stream unchanged.
## US6: Delete an income stream
As a user, I want to remove an income stream I no longer have so that my income isn't overstated.
FR: FR5
Priority: Must
MVP: yes
- [ ] Each income stream has a "Delete" option.
- [ ] The user is asked to confirm before the income stream is removed.
- [ ] The deleted stream is removed from the list, and total monthly income recalculates.
# E2: Budgeting & savings goals
Users can set spending limits and savings targets to plan their month and avoid overspending.
 
## US7: Set an overall monthly budget
As a user, I want to set how much I plan to spend this month so that I know when to slow down.
FR: FR7
Priority: Must
MVP: yes
- [ ] The user can enter a total monthly budget amount.
- [ ] A budget that is not a positive number is rejected, and the user sees an error message.
- [ ] The main page shows the budget, the total spent, and the amount remaining.
- [ ] The remaining amount updates whenever an expense is added, edited, or deleted.
## US8: Set category budgets
As a user, I want separate budgets for categories like food, transportation, and entertainment so that I can control spending in each area.
FR: FR7
Priority: Should
MVP: no
- [ ] The user can set a budget amount for each expense category.
- [ ] Each category shows its budget, amount spent, and amount remaining.
- [ ] A visual warning appears when a category goes over its budget.
- [ ] Category spending totals are 100% accurate.
## US9: View budget status at a glance
As a user, I want a dashboard showing my income, spending, and remaining budget so that I can check my status quickly.
FR: FR7, NFR1, NFR2
Priority: Must
MVP: yes
- [ ] The dashboard shows total income, total expenses, remaining budget, and savings goal progress.
- [ ] The dashboard loads in under 1 second.
- [ ] All numbers on the dashboard match the underlying entries exactly.
## US10: Create a savings goal
As a user, I want to set an amount I want to save each month so that I can build savings from my income.
FR: FR10
Priority: Should
MVP: no
- [ ] The user can enter a savings goal name and a monthly target amount.
- [ ] A target that is not a positive number is rejected, and the user sees an error message.
- [ ] A target greater than total monthly income shows a warning.
- [ ] The goal appears on the dashboard with its progress (income minus expenses compared to the target).
## US11: Edit a savings goal
As a user, I want to change my savings goal when my situation changes so that it stays realistic.
FR: FR11
Priority: Should
MVP: no
- [ ] Each savings goal has an "Edit" option with its current values pre-filled.
- [ ] The user can change the goal's name or target amount.
- [ ] Saving updates the goal's progress calculation accurately.
## US12: Delete a savings goal
As a user, I want to delete a savings goal I no longer need so that my dashboard only shows active goals.
FR: FR12
Priority: Should
MVP: no
- [ ] Each savings goal has a "Delete" option.
- [ ] The user is asked to confirm before the goal is removed.
- [ ] The deleted goal no longer appears on the dashboard.
