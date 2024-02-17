import React from 'react';
import { useState, useReducer, useContext } from 'react';
import Logo from '../../assets/logo-black.png';
import Switch from 'react-switch';
import { store } from '../../store';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../../util';
import { API_URL } from '../../Api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'REQUEST_COMPLETED':
      return { ...state, loading: false };
  }
};

const Salonprofile = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(store);
  const { user } = state;
  const [openTime, setOpentime] = useState(user.openingTime);
  const [closeTime, setClosetime] = useState(user.closingTime);
  const [isOpenToday, setIsOpenToday] = useState(true);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobile);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [salonstate, setSalonState] = useState(user.state);
  const [pincode, setPincode] = useState(user.pincode);
  const [salonPhotos, setSalonPhotos] = useState(user.salonPhotos || []);
  const [stylistPhotos, setStylistPhotos] = useState(user.stylistPhotos || []);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'FETCH_REQUEST' });
    const ref = document.getElementById('sp-services');
    const services = ref.innerText.split(',').map((e) => {
      return e.trim();
    });
    if (services[services.length - 1] === '') {
      services.pop();
    }

    try {
      const { data } = await axios.put(
        API_URL+`api/salon/${user._id}`,
        {
          name,
          email,
          mobile,
          address,
          city,
          salonstate,
          pincode,
          services,
          // salonPhotos,
          // stylistPhotos,
          openTime,
          closeTime,
          isOpenToday,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      ctxDispatch({ type: 'SIGN_IN', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
    } catch (e) {
      toast.error(getError(e));
    }
    dispatch({ type: 'REQUEST_COMPLETED' });
  };

  const imghandler = async (e) => {
    var file = e.target.files[0];
    const base64String = await converToBase64(file);
    if (e.target.name === 'stylist') {
      setStylistPhotos((old) => [...old, base64String]);
    } else {
      setSalonPhotos((old) => [...old, base64String]);
    }
  };

  const converToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className="salonprofile">
      {loading ? (
        <div className="progress"></div>
      ) : (
        <>
          <div className="sp-contents d-flex">
            <div className="sp-left">
              <div className="sp-user-details d-flex">
                <div className="sp-inputs-left flex-column">
                  <h3>SHOP NAME</h3>
                  <h3>EMAIL</h3>
                  <h3>MOBILE</h3>
                  <h3>ADDRESS</h3>
                  <h3>CITY</h3>
                  <h3>STATE</h3>
                  <h3>PINCODE</h3>
                  <h3>OPENING TIME</h3>
                  <h3>CLOSING TIME</h3>
                  <h3>SERVICES PROVIDED</h3>
                </div>
                <div className="sp-inputs-right flex-column">
                  <input
                    className="sp-text-input"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <input
                    className="sp-text-input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <input
                    className="sp-text-input"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                  <input
                    className="sp-text-input"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                  <input
                    className="sp-text-input"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                  <input
                    className="sp-text-input"
                    value={salonstate}
                    onChange={(e) => {
                      setSalonState(e.target.value);
                    }}
                  />
                  <input
                    className="sp-text-input"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                    }}
                  />
                  <input
                    className="sp-text-input"
                    type="time"
                    value={openTime}
                    onChange={(e) => {
                      setOpentime(e.target.value);
                    }}
                  />

                  <input
                    className="sp-text-input"
                    type="time"
                    value={closeTime}
                    onChange={(e) => {
                      setClosetime(e.target.value);
                    }}
                  />
                  <div
                    id="sp-services"
                    className="sp-text-input"
                    contentEditable="true"
                  >
                    {user.services.map((e) => {
                      return ` ${e} ,`;
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="sp-right">
              <div className="ss-right-toogle flex-center">
                <h1>Is shop opened today ? </h1>
                <Switch
                  checked={isOpenToday}
                  onChange={(val) => setIsOpenToday(val)}
                />
              </div>
              <div className="gallery">
                <h1>GALLERY</h1>
                <div className="salonphotos-div">
                  <h2>SALON PHOTOS</h2>
                  <div className="salonphotos">
                    { salonPhotos.map((e) => {
                      return (
                        <div className="salonphoto">
                          <img src={e} alt="" />
                        </div>
                      );
                    })}
                    {salonPhotos.length < 5 ? (
                      <>
                        <input
                          type="file"
                          id="salon-img-input"
                          className="salon-img-input"
                          name="salon"
                          accept="image/png, image/jpeg"
                          onChange={imghandler}
                        />

                        <label htmlFor="salon-img-input">
                          <div className="salonphoto-add flex-center">
                            <i className="fa-solid fa-circle-plus"></i>
                          </div>
                        </label>
                      </>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                <div className="salonphotos-div">
                  <h2>STYLIST PHOTOS</h2>
                  <div className="salonphotos">
                    {stylistPhotos.map((e) => {
                      return (
                        <div className="stylistphoto">
                          <img src={e} alt="" />
                        </div>
                      );
                    })}
                    {stylistPhotos.length < 5 ? (
                      <>
                        <input
                          type="file"
                          id="stylist-img-input"
                          className="salon-img-input"
                          accept="image/png, image/jpeg"
                          name="stylist"
                          onChange={imghandler}
                        />
                        <label htmlFor="stylist-img-input">
                          <div className="stylistphoto-add flex-center">
                            <i className="fa-solid fa-circle-plus "></i>
                          </div>
                        </label>
                      </>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-center" style={{ margin: '1rem auto' }}>
            <button className="sp-btn flex-center" onClick={submitHandler}>
              <img src={Logo} />
              <h3>SAVE CHANGES</h3>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Salonprofile;
