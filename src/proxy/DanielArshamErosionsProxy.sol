// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

/*

    ██████╗  █████╗ ███╗   ██╗██╗███████╗██╗
    ██╔══██╗██╔══██╗████╗  ██║██║██╔════╝██║
    ██║  ██║███████║██╔██╗ ██║██║█████╗  ██║
    ██║  ██║██╔══██║██║╚██╗██║██║██╔══╝  ██║
    ██████╔╝██║  ██║██║ ╚████║██║███████╗███████╗
    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚══════╝

  █████╗ ██████╗ ███████╗██╗  ██╗ █████╗ ███╗   ███╗
 ██╔══██╗██╔══██╗██╔════╝██║  ██║██╔══██╗████╗ ████║
 ███████║██████╔╝███████╗███████║███████║██╔████╔██║
 ██╔══██║██╔══██╗╚════██║██╔══██║██╔══██║██║╚██╔╝██║
 ██║  ██║██║  ██║███████║██║  ██║██║  ██║██║ ╚═╝ ██║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝

                       ______
                      /     /\
                     /     /##\
                    /     /####\
                   /     /######\
                  /     /########\
                 /     /##########\
                /     /#####/\#####\
               /     /#####/++\#####\
              /     /#####/++++\#####\
             /     /#####/\+++++\#####\
            /     /#####/  \+++++\#####\
           /     /#####/    \+++++\#####\
          /     /#####/      \+++++\#####\
         /     /#####/        \+++++\#####\
        /     /#####/__________\+++++\#####\
       /                        \+++++\#####\
      /__________________________\+++++\####/
      \+++++++++++++++++++++++++++++++++\##/
       \+++++++++++++++++++++++++++++++++\/
        ``````````````````````````````````

              ██████╗██╗  ██╗██╗██████╗
             ██╔════╝╚██╗██╔╝██║██╔══██╗
             ██║      ╚███╔╝ ██║██████╔╝
             ██║      ██╔██╗ ██║██╔═══╝
             ╚██████╗██╔╝ ██╗██║██║
              ╚═════╝╚═╝  ╚═╝╚═╝╚═╝

*/

import "../interface/ICxipRegistry.sol";

// sha256(abi.encodePacked('eip1967.CxipRegistry.DanielArshamErosionsProxy')) == 0x34614b2160c4ad0a9004a062b1210e491f551c3b3eb86397949dc0279cf60c0d
contract DanielArshamErosionsProxy {
    fallback() external payable {
        // sha256(abi.encodePacked('eip1967.CxipRegistry.DanielArshamErosions')) == 0x748042799f1a8ea5aa2ae183edddb216f96c3c6ada37066aa2ce51a56438ede7
        address _target = ICxipRegistry(0xdeaDDeADDEaDdeaDdEAddEADDEAdDeadDEADDEaD).getCustomSource(0x748042799f1a8ea5aa2ae183edddb216f96c3c6ada37066aa2ce51a56438ede7);
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _target, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}