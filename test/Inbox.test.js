const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INIT_MESSAGE = "Hello";
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INIT_MESSAGE] })
        .send({ from: accounts[0], gas: '1000000' });
});
describe('Inbox', () => {
    it('Deploy inbox', () => {
        console.log(inbox);
        assert.ok(inbox.options.address);
    })
    it('Test init message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INIT_MESSAGE);
    })
    it('Test update message', async () => {
        const newMess = "Bye";
        await inbox.methods.setMessage(newMess).send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, newMess);
    })
})