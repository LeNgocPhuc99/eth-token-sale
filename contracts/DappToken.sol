// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DappToken {
    // Name
    string public name = "DApp Token";
    string public symbol = "DAPP";
    string public standard = "DApp Token v1.0";
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initSupply) {
        balanceOf[msg.sender] = _initSupply;
        totalSupply = _initSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // approve
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        // Approval event
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // require _from has enough tokens
        require(_value <= balanceOf[_from]);
        // require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);
        // change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        // update the allowance
        allowance[_from][msg.sender] -= _value;
        // transfer event
        emit Transfer(_from, _to, _value);
        // return a boolean
        return true;
    }
}
