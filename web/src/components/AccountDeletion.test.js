import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountDeletionBoundary, { AccountDeletionCard } from "./AccountDeletion";
const mockCall = jest.fn();
const mockReauth = jest.fn();
const mockUser = { uid:"student",email:"student@example.com",providerData:[{providerId:"password"}],getIdToken:jest.fn().mockResolvedValue("fresh") };
let mockSnapshot;
jest.mock("../context/AuthContext",()=>({useAuth:()=>({user:mockUser,logout:jest.fn()})}));
jest.mock("../firebase",()=>({db:{},functions:{},doc:jest.fn(),getDoc:jest.fn().mockResolvedValue({data:()=>null}),onSnapshot:jest.fn((ref,callback)=>{mockSnapshot=callback;return ()=>{};}),httpsCallable:jest.fn(()=>mockCall)}));
jest.mock("firebase/auth",()=>({EmailAuthProvider:{credential:jest.fn()},GoogleAuthProvider:jest.fn(),reauthenticateWithCredential:(...args)=>mockReauth(...args),reauthenticateWithPopup:jest.fn()}));
beforeEach(()=>{mockCall.mockReset();mockReauth.mockReset();mockReauth.mockResolvedValue({});});
test("requires explicit confirmation and reauthentication before scheduling deletion",async()=>{
 mockCall.mockResolvedValue({data:{status:"pending",deleteAt:"2026-12-01T00:00:00.000Z"}});
 render(<AccountDeletionCard/>);
 await waitFor(()=>expect(screen.queryByText(/temporarily unavailable/)).toBeNull());
 expect(screen.getByRole("button",{name:"Request account deletion"})).toBeDisabled();
 fireEvent.change(screen.getByLabelText(/Type DELETE/),{target:{value:"DELETE"}});
 fireEvent.change(screen.getByLabelText(/Confirm your password/),{target:{value:"password"}});
 fireEvent.click(screen.getByRole("button",{name:"Request account deletion"}));
 await waitFor(()=>expect(mockCall).toHaveBeenCalledWith({confirmation:"DELETE"}));
 expect(mockReauth).toHaveBeenCalledTimes(1);
 expect(screen.getByRole("heading",{name:"Account deletion scheduled"})).toBeInTheDocument();
});
test("failed reauthentication does not submit deletion",async()=>{
 mockReauth.mockRejectedValue({code:"auth/invalid-credential"});
 render(<AccountDeletionCard/>);
 await waitFor(()=>expect(screen.queryByText(/temporarily unavailable/)).toBeNull());
 fireEvent.change(screen.getByLabelText(/Type DELETE/),{target:{value:"DELETE"}});
 fireEvent.change(screen.getByLabelText(/Confirm your password/),{target:{value:"wrong"}});
 fireEvent.click(screen.getByRole("button",{name:"Request account deletion"}));
 await screen.findByRole("alert");expect(mockCall).not.toHaveBeenCalled();
});
test("recovery uses the cancellation endpoint",async()=>{
 mockCall.mockResolvedValue({data:{status:"cancelled"}});
 render(<AccountDeletionCard pending={{status:"pending",deleteAt:"2099-01-01T00:00:00Z"}}/>);
 fireEvent.change(screen.getByLabelText(/Confirm your password/),{target:{value:"password"}});
 fireEvent.click(screen.getByRole("button",{name:/Cancel deletion/}));
 await waitFor(()=>expect(mockCall).toHaveBeenCalled());
 expect(require("../firebase").httpsCallable).toHaveBeenCalledWith({},"cancelAccountDeletion");
});
test("pending account blocks learning content",async()=>{
 const {act}=require("@testing-library/react");
 render(<AccountDeletionBoundary><p>Learning content</p></AccountDeletionBoundary>);
 expect(screen.queryByText("Learning content")).toBeNull();
 act(()=>mockSnapshot({data:()=>({status:"pending",deleteAt:"2099-01-01T00:00:00Z"})}));
 expect(screen.queryByText("Learning content")).toBeNull();
 expect(screen.getByRole("heading",{name:"Account deletion scheduled"})).toBeInTheDocument();
 act(()=>mockSnapshot({data:()=>({status:"cancelled"})}));
 expect(screen.getByText("Learning content")).toBeInTheDocument();
});
test("Google recovery reauthenticates with Google before cancellation",async()=>{
 const {reauthenticateWithPopup}=require("firebase/auth");
 mockUser.providerData=[{providerId:"google.com"}];
 reauthenticateWithPopup.mockResolvedValue({});
 mockCall.mockResolvedValue({data:{status:"cancelled"}});
 render(<AccountDeletionCard pending={{status:"pending",deleteAt:"2099-01-01T00:00:00Z"}}/>);
 expect(screen.queryByLabelText(/Confirm your password/)).toBeNull();
 fireEvent.click(screen.getByRole("button",{name:/Cancel deletion/}));
 await waitFor(()=>expect(mockCall).toHaveBeenCalled());
 expect(reauthenticateWithPopup).toHaveBeenCalledWith(mockUser,expect.any(Object));
 mockUser.providerData=[{providerId:"password"}];
});

test("unavailable rules keep the deletion button disabled",async()=>{
 const {getDoc}=require("../firebase");
 getDoc.mockRejectedValueOnce({code:"permission-denied"});
 render(<AccountDeletionCard/>);
 fireEvent.change(screen.getByLabelText(/Type DELETE/),{target:{value:"DELETE"}});
 await screen.findByText(/temporarily unavailable/);
 expect(screen.getByRole("button",{name:"Request account deletion"})).toBeDisabled();
 expect(mockCall).not.toHaveBeenCalled();
});
