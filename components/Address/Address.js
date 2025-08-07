"use client";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useFetchAddressMutation,
} from "@/features/api/addressApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Address = ({ userId, handleAddressChoose }) => {
  const [addressToggle, setAddressToggle] = useState(false);
  const [addNewAddress] = useAddAddressMutation();
  const [fetchAddress, { isLoading, refetch }] = useFetchAddressMutation();
  const [existingAddresses, setExistingAddresses] = useState([]);
  const [deleteAddress] = useDeleteAddressMutation();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [details, setDetails] = useState({
    userId,
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    addressType: "",
  });
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "postalCode") {
      const isValidTamilNaduPincode = /^6[0-4][0-9]{4}$/.test(value);

      if (!isValidTamilNaduPincode && value.length === 6) {
        alert("We only deliver to Tamil Nadu PIN codes ");
        return;
      }
    }
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetchAddress(userId).unwrap();
        setExistingAddresses(response.data);
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };

    fetchAddresses();
  }, [userId]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await addNewAddress(details).unwrap();
      if (response) {
        toast.success("Address saved successfully");
        setAddressToggle(false);
        setDetails({
          userId,
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          country: "India",
          postalCode: "",
          addressType: "",
        });
        window.location.reload();
      } else {
        toast.error("Failed to add Address");
      }
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };
  const handleRemoveAddress = async (addressId) => {
    try {
      const response = await deleteAddress(addressId).unwrap();
      if (response) {
        window.location.reload();
        toast.success("Address removed successfully");
      } else {
        toast.error("Failed to remove address");
      }
    } catch (error) {
      console.log("Failed to remove address:", error);
      toast.error("Error in removing address");
    }
  };
  const handleSelectedAddress = (e, address) => {
    e.stopPropagation();
    setSelectedAddress(address._id);
    handleAddressChoose(address);
    console.log("Selected address:", address._id);
  };

  return (
    <>
      <div>
        <div className="d-flex justify-align-content-start align-items-start">
          <div className="address-section">
            <h2 className="address-section-title">Your Saved Addresses</h2>

            {existingAddresses.length > 0 ? (
              existingAddresses.map((address) => (
                <div
                  key={address._id}
                  className={`address-card ${
                    selectedAddress === address._id
                      ? "address-card--selected"
                      : ""
                  }`}
                  onClick={(e) => handleSelectedAddress(e, address)}
                >
                  <button
                    className="address-card__remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAddress(address._id);
                    }}
                  >
                    ✖
                  </button>

                  <div className="address-card__content">
                    <p className="address-card__name">{address.fullName}</p>
                    <p className="address-card__line">📞 {address.phone}</p>

                    <p className="address-card__line ">
                      📍{address.addressLine1}
                    </p>
                    <p className="address-card__line text-uppercase">
                      {address.city}, {address.state}
                    </p>
                    <p className="address-card__line text-uppercase">
                      {address.postalCode}
                    </p>
                    {address.addressLine2 && (
                      <p className="address-card__line text-uppercase">
                        {address.addressLine2}
                      </p>
                    )}
                    <span className="address-card__type text-uppercase">
                      {address.addressType}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-addresses-message">No addresses found</div>
            )}

            <button
              onClick={() => setAddressToggle(!addressToggle)}
              className="custom-checkout-new-button"
            >
              ➕ Add New Address
            </button>
          </div>

          <style>
            {`
        .address-section {
          padding: 20px;
          max-width: 600px;
          margin: auto;
        }

        .address-section-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          text-align: center;
          color: #333;
        }

        .address-card {
          position: relative;
          background-color: #fafafa;
          border: 2px solid transparent;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .address-card--selected {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }

        .address-card__remove {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: transparent;
          color: #ff4d4f;
          border: none;
          font-size: 1rem;
          cursor: pointer;
        }

        .address-card__remove:hover {
          color: #ff0000;
        }

        .address-card__content {
          padding: 20px;
        }

        .address-card__name {
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .address-card__line {
          margin: 2px 0;
          color: #555;
          word-break: break-word;
          font-size: 0.9rem;
        }

        .address-card__type {
          display: inline-block;
          margin-top: 10px;
          padding: 4px 8px;
          background-color: #e6f7ff;
          color: #007bff;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .no-addresses-message {
          text-align: center;
          color: #999;
          margin: 20px 0;
        }

        .add-address-button {
          display: block;
          margin: 20px auto 0;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .add-address-button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 480px) {
          .address-section {
            padding: 10px;
          }

          .address-card {
            padding: 12px;
          }

          .address-card__name {
            font-size: 1rem;
          }

          .add-address-button {
            width: 100%;
          }
        }
        `}
          </style>
        </div>
        {addressToggle && (
          <form onSubmit={saveAddress} className="custom-checkout-new-form">
            <div className="custom-checkout-new-billing">
              <h3 className="custom-checkout-new-section-title">
                Billing Details
              </h3>
              <div className="custom-checkout-new-form-grid">
                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    Full Name{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="custom-checkout-new-input"
                    placeholder="Full Name"
                    required
                    value={details.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    Phone{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className="custom-checkout-new-input"
                    placeholder="Phone Number"
                    required
                    value={details.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    Address Line 1{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    className="custom-checkout-new-input"
                    placeholder="Street address"
                    required
                    value={details.addressLine1}
                    onChange={handleChange}
                  />
                </div>

                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    Address Line 2{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    className="custom-checkout-new-input"
                    placeholder="Apartment, suite, unit etc."
                    value={details.addressLine2}
                    onChange={handleChange}
                  />
                </div>

                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    Town / City{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="custom-checkout-new-input"
                    placeholder="Town / City"
                    required
                    value={details.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    State{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="custom-checkout-new-input"
                    placeholder="State"
                    required
                    value={details.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    Postcode / Zip{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    className="custom-checkout-new-input"
                    placeholder="Only Tamil Nadu PIN codes"
                    maxLength="6"
                    required
                    value={details.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="custom-checkout-new-form-row">
                  <label className="custom-checkout-new-label">
                    Country{" "}
                    <span className="custom-checkout-new-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="custom-checkout-new-input"
                    value="India"
                    disabled
                    name="country"
                    required
                  />
                </div>
              </div>

              <label
                className="custom-checkout-new-label"
                htmlFor="addressType"
              >
                Select Address Type{" "}
                <span className="custom-checkout-new-required">*</span>
              </label>
              <select
                name="addressType"
                value={details.addressType}
                className="custom-checkout-new-select"
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select any type
                </option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Friends">Friends</option>
              </select>

              <button type="submit" className="custom-checkout-new-button mt-3">
                Save Address
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Address;
