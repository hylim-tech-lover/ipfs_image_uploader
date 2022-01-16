// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract SimpleStorage {
  string ipfshash;

  function set(string memory x) public {
    ipfshash = x;
  }

  function get() public view returns (string memory) {
    return ipfshash;
  }
}
