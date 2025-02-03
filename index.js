const EventEmitter = require('node:events');

class Bank extends EventEmitter{
    #persons;
    #countID;

    constructor(){
        super();
        this.#persons = [];
        this.#countID = 0;
    }

    register(person){
        if(this.#persons.some(people => people.name === person.name) || person.balance <= 0)
            this.emit('error');
        this.#countID +=1;
        person.personId = this.#countID;
        this.#persons.push(person);
        return person.personId;
    }

    add(personId, sum){
        if(sum <= 0)
            this.emit('error');     
        const index = this.#persons.findIndex(person => person.personId === personId);
        if(index === -1)
            this.emit('error');
        this.#persons[index].balance += sum;    
    }

    get(personId, fCall){
        const index = this.#persons.findIndex(person => person.personId === personId);
        if(index === -1)
            this.emit('error');
        const balance = this.#persons[index].balance;
        fCall(balance);
    }

    withdraw(personId, sum){
        if(sum <= 0)
            this.emit('error');
        const index = this.#persons.findIndex(person => person.personId === personId);
        
        if(this.#persons[index].balance - sum < 0 || index === -1 || this.#persons[index].fLimit)       
            if(!this.#persons[index].fLimit(sum, this.#persons[index].balance, this.#persons[index].balance-sum))           
                this.emit('error');
        this.#persons[index].balance -= sum;
    }

    send(FirstId, SecondId, sum){
        if(sum <= 0)
            this.emit('error');
        const indexFirst = this.#persons.findIndex(person => person.personId === FirstId);
        const indexSecond = this.#persons.findIndex(person => person.personId === SecondId);
        if(indexFirst === -1 || indexSecond === -1 || this.#persons[indexFirst].fLimit || this.#persons[indexSecond].fLimit){
            if(this.#persons[indexFirst].fLimit 
                && !this.#persons[indexFirst].fLimit(sum, this.#persons[indexFirst].balance, this.#persons[indexFirst].balance-sum)){
                this.emit('error')
            }else if (this.#persons[indexSecond].fLimit 
                && !this.#persons[indexSecond].fLimit(sum, this.#persons[indexSecond].balance, this.#persons[indexSecond].balance+sum)){                    
                this.emit('error') 
            }
        }
            
        this.#persons[indexFirst].balance -= sum;
        this.#persons[indexSecond].balance += sum;
    }

    changeLimit(personId, fCall){
        const index = this.#persons.findIndex(person => person.personId === personId);
        if(index === -1)
            this.emit('error');
        this.#persons[index].fLimit = fCall;      
    }
}


const bank = new Bank();

bank.on('add', (personId, sum) =>{
    bank.add(personId, sum);
})

bank.on('get', (personId, fCall) =>{
    bank.get(personId, fCall);
})

bank.on('withdraw', (personId, sum) =>{
    bank.withdraw(personId, sum);
})

bank.on('send', (FirstId, SecondId, sum) =>{
    bank.send(FirstId, SecondId, sum);
})

bank.on('changeLimit', (personId, fCall) =>{
    bank.changeLimit(personId, fCall);
})

bank.on('error', () =>{
    throw new Error("Something went wrong!");
});


const personId = bank.register({
 name: 'Pitter Black',
 balance: 100
});

bank.emit('add', personId, 20);

bank.emit('get', personId, (balance) => {
 console.log(`I have ${balance}$`); //I have 120$
});

bank.emit('withdraw', personId, 50);

bank.emit('get', personId, (balance) => {
 console.log(`I have ${balance}$`); //I have 70$
});


const personFirstId = bank.register({
    name: 'Pitter Dick',
    balance: 100
   });

const personSecondId = bank.register({
    name: 'Oliver White',
    balance: 700
   });

bank.emit('changeLimit', personSecondId, (amount, currentBalance,
    updatedBalance) => {
    return amount < 100 && updatedBalance < 800;
});

bank.emit('send', personFirstId, personSecondId, 50);

bank.emit('get', personSecondId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 750₴
});


const personThreeId = bank.register({
    name: 'John Watson',
    balance: 700,
    limit: amount => amount < 10
   });

bank.emit('withdraw', personThreeId, 5);

bank.emit('get', personThreeId, (amount) => {
    console.log(`I have ${amount}₴`); // I have 695₴
});

bank.emit('changeLimit', personThreeId, (amount, currentBalance,
    updatedBalance) => {
     return amount < 100 && updatedBalance < 700;
});

bank.emit('withdraw', personThreeId, 5);

bank.emit('get', personThreeId, (amount) => {
    console.log(`I have ${amount}₴`); // I have 690₴
});