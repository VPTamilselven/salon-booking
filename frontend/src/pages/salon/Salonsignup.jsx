import React,{useState} from 'react';
import ss from '../../assets/ss.svg'
import logo from '../../assets/logo.png'
import { toast } from 'react-toastify';
import { getError } from '../../util';
import axios from 'axios';
import { useContext } from 'react';
import { store } from '../../store';
import { API_URL } from '../../Api';

const Salonsignup = () => {
  
  const { state, dispatch: ctxDispatch }=useContext(store)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [salonstate, setSalonState] = useState();
  const [pincode, setPincode] = useState('');
  const [service,setService]=useState('');
  const [password,setPassword]=useState('');
  const [cpassword,setCpassword]=useState('');
  const submitHandler =async (e) => {
    e.preventDefault();
    try{
      if(password===cpassword){
      const services=service.split(',').map((e) => {
        return e.trim();
      })
       const {data}=await axios.post(API_URL+'api/salon/',{
        
        name,
        email,
        mobile,
        address,
        city,
        salonstate,
        pincode,
        services,
        password
      })
      console.log(data);
      ctxDispatch({type:'SIGN_IN',payload:data})
      localStorage.setItem('user',JSON.stringify(data));
      window.location.href='/'
    }else{
      toast.error("Password doesn't match")
    }
    }catch(e){
      toast.error(getError(e));
    }
  };

  return (
    <div className="salon-signup">
      <h1>Salon Registration</h1>
      <div className="ss">
        <div className="ss-left">
          <div className="ss-salon-details">
            <h2>Enter Your Salon Details Below</h2>

            <div className="ss-form-div">
              <div className="ss-form-labels">
                <p className="ss-form-label">SHOP NAME</p>
                <p className="ss-form-label">EMAIL</p>
                <p className="ss-form-label">MOBILE</p>
                <p className="ss-form-label">ADDRESS</p>
                <p className="ss-form-label">CITY</p>
                <p className="ss-form-label">STATE</p>
                <p className="ss-form-label">PIN CODE</p>
                <p className="ss-form-label">PASSWORD</p>
                <p className="ss-form-label">CONFIRM PASSWORD</p>
                <p className="ss-form-label">SERVICES PROVIDED</p>
              </div>
              <div className="ss-form-inputs">
                <form id="ss-form" className="ss-form" onSubmit={submitHandler}>
                  <input
                    className="ss-input"
                    type="text"
                    name="name"
                    placeholder="Enter your shop name"
                    value={name}
                    required
                    onChange={(e)=>setName(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    required
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="tel"
                    name="mobile"
                    pattern="[0-9]{10}"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    required
                    onChange={(e)=>setMobile(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="text"
                    name="address"
                    placeholder="Enter your address line 1"
                    value={address}
                    required
                    onChange={(e)=>setAddress(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    value={city}
                    required
                    onChange={(e)=>setCity(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="text"
                    name="state"
                    placeholder="Enter your State"
                    value={salonstate}
                    required
                    onChange={(e)=>setSalonState(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="number"
                    name="pincoe"
                    pattern="[0-9]{6}"
                    value={pincode}
                    placeholder="Enter your PIN code"
                    required
                    onChange={(e)=>setPincode(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    required
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="password"
                    name="cpassword"
                    value={cpassword}
                    placeholder="Retype the password"
                    required
                    onChange={(e)=>setCpassword(e.target.value)}
                  />
                  <input
                    className="ss-input"
                    type="text"
                    name="state"
                    value={service}
                    placeholder="Comma separated values (i.e Shaving, Facial,)"
                    required
                    onChange={(e)=>setService(e.target.value)}
                  />
                </form>
              </div>
            </div>
            <div className="ss-btn-div">
              <button form="ss-form" type="submit" className="ss-btn">
                <i className="fa-solid fa-arrow-right "></i>
                <p>Signup</p>
              </button>
            </div>
          </div>
        </div>
        <div className="ss-right">
            <img className='ss-logo' src={logo} alt="" />
            <img className='ss-img' src={ss} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Salonsignup;
