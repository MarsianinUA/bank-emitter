# bank-emitter

A bank management module has been implemented

The **register** method registers a new counterparty. The method returns the identifier of the counterparty  
The **add** event takes the counterparty ID as the second argument and credits the amount as the third argument  
The **get** event takes a counterparty identifier as the second argument and a colback function as the third argument. Callback takes one argument **balance**, which indicates the amount of money at the time of event generation  
The **withdraw** event takes the counterparty ID as the second argument and the debit amount as the third argument. The event withdraws money from the counterparty's account  
The **send** event takes the ID of the counterparty that transfers the money as the second argument and the ID of the counterparty that receives the money as the third argument  
The **changeLimit** event sets a limit at which no funds transfer occurs for a particular ID
