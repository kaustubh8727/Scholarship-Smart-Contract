pragma solidity ^0.5.16;

contract Scholarship{
    address public ClassCordinator;
    address public HOD;
    address public ExaminationCell;
    address payable public  AccountDepartment;

    struct Record {
        uint256 UniversityRollno;
        uint256 ClassRollno;
        uint256 signatureCount;
        uint256 Credits;
        string StudentName;
        string SGPA;
        string Course;
        string Branch;
        address payable Addr;
        bool isApplied;
        bool AmountPayed;
        //uint256 Scholarship;
        mapping (address => bool) signatures;
    }
    mapping (uint256 => bool) public checkForApply;
    uint public RecordsCount;

    modifier signOnly {
        require (msg.sender == ClassCordinator || msg.sender == HOD || msg.sender == ExaminationCell);
        _;
    }

    constructor() public {
        ClassCordinator = msg.sender;
        HOD=0x32072E1111A838879A37B15209b3c77F6531BCdA;
        ExaminationCell=0xd0E4b87849F7DbD22068b97F28bacf465809649a;
        AccountDepartment=0x583DC8754D3e41495a2317De73b1E065D512192f;
    }

    mapping (address=> Record) public records;
    address[] public recordsArr;

    function newRecord (uint256 _UniversityRollno,uint256 _ClassRollno, uint256 _Credits, string memory _StudentName, string memory _SGPA, string memory _Course, string memory _Branch) public {
        Record storage _newrecord = records[msg.sender];
        // only allow students not faculty
        require(msg.sender != ClassCordinator);
        require(msg.sender != HOD);
        require(msg.sender != ExaminationCell);
        require(msg.sender != AccountDepartment);
        // Only allows new records to be created
        require(!checkForApply[_UniversityRollno]);
        require(!records[msg.sender].isApplied);
        _newrecord.UniversityRollno=_UniversityRollno;
        _newrecord.ClassRollno=_ClassRollno;
        _newrecord.Credits=_Credits;
        _newrecord.StudentName=_StudentName;
        _newrecord.SGPA=_SGPA;
        _newrecord.Course=_Course;
        _newrecord.Branch=_Branch;
        _newrecord.Addr = msg.sender;
        _newrecord.isApplied=true;
        //_newrecord.Scholarship=0;
        checkForApply[_UniversityRollno]=true;
        recordsArr.push(msg.sender);
        RecordsCount ++;
    }

    function signRecord(address _address) signOnly public {
        Record storage _OldRecord = records[_address];
        // Checks the aunthenticity of the address signing it
        require(msg.sender != _OldRecord.Addr);
        // is the record exists
        require(_OldRecord.isApplied);
        require(checkForApply[_OldRecord.UniversityRollno]);
        // Doesn't allow the same person to sign twice
        require(!_OldRecord.signatures[msg.sender]);

        _OldRecord.signatures[msg.sender] = true;
        _OldRecord.signatureCount++;
    }

    function payAmount(address _address) payable public {
        Record storage _OldRecord = records[_address];
        //check whether amount has payed or not
        require(msg.sender==AccountDepartment);
        require(!_OldRecord.AmountPayed);
        //check whether approved or not
        require(_OldRecord.signatureCount==3);
        address(_OldRecord.Addr).transfer(msg.value);
        _OldRecord.AmountPayed=true;
        //_OldRecord.Scholarship=_OldRecord.Scholarship + 5;
    }
}
