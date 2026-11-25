import {managedUpgradeState, verifiedLevelBalance, legacyUpgradeOverlap} from "./levelUpgradeBilling";
const a1={program:"german",level:"A1",status:"expired",tuitionFee:3000,paid:3000,balanceDue:0,contractEnd:"2000-01-01"};
const a2={program:"german",level:"A2",status:"active",tuitionFee:3000,paid:2000,balanceDue:1000,contractEnd:"2099-12-31"};
test("per-level balance requires reconciled numeric amounts",()=>{
 expect(verifiedLevelBalance(a2)).toBe(1000);
 expect(verifiedLevelBalance({...a2,balanceDue:0})).toBeNull();
 expect(verifiedLevelBalance({...a2,paid:null})).toBeNull();
});
test("paid revision access does not make an expired historical level an active paid contract",()=>{
 const state=managedUpgradeState({paidLevel:"A1",grantedEnrollmentLevels:["A1","A2"]},[a1,a2]);
 expect(state.current.level).toBe("A1");
 expect(state.next.level).toBe("A2");
 expect(state.granted).toEqual(["A1","A2"]);
});
test("fully paid active level supersedes a stale legacy level",()=>{
 const state=managedUpgradeState({paidLevel:"A1",grantedEnrollmentLevels:["A1","A2"]},[a1,{...a2,paid:3000,balanceDue:0}]);
 expect(state.current.level).toBe("A2");
 expect(state.nextLevel).toBe("B1");
});
test("overlapping open upgrade is detected without treating completed upgrades as payable",()=>{
 const profile={upgradeStatus:"pending",upgradeToLevel:"A2"};
 expect(managedUpgradeState(profile,[a1,a2]).overlap).toBe(true);
 expect(legacyUpgradeOverlap(profile,a2)).toBe(true);
 expect(legacyUpgradeOverlap({...profile,upgradeStatus:"completed"},a2)).toBe(false);
});
