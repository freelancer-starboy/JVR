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
    e.stopPropagation()
    setSelectedAddress(address._id);
    handleAddressChoose(address);
    console.log("Selected address:", address._id);
  }

  return (
    <>
      <div>
        <div className="d-flex justify-align-content-start align-items-start">
          <div className="custom-address-container">
            <div className="custom-address-title">Existing Addresses</div>
            {existingAddresses &&
              existingAddresses.length > 0 &&
              existingAddresses.map((address) => (
                
                <div className={`custom-address-card ${
                  selectedAddress === address._id ? "selected-address" : ""
                }`} key={address._id} onClick={(e) => handleSelectedAddress(e, address)}>
                  <button
                    className="custom-address-remove-button"
                    onClick={(e) => {e.stopPropagation();handleRemoveAddress(address._id)}}
                    style={{ zIndex: "999"}}
                  >
                    Remove
                  </button>
                  <p className="custom-address-name">{address.fullName}</p>
                  <div className="custom-address-details">
                    <p className="custom-address-line">📱 {address.phone}</p>
                    <p className="custom-address-line">
                      📍 {address.city}, {address.state}
                    </p>
                    <p className="custom-address-line">{address.postalCode}</p>
                  </div>
                  <p className="custom-address-line">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="custom-address-line">
                      {address.addressLine2}
                    </p>
                  )}
                  <span className="custom-address-type">
                    {address.addressType}
                  </span>
                </div>
              ))}
            {(!existingAddresses || existingAddresses.length === 0) && (
              <div>No addresses found</div>
            )}
            <button
              onClick={() => setAddressToggle(!addressToggle)}
              className="custom-address-add-button"
            >
              Add New Address
            </button>
          </div>
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
                    placeholder="John Doe"
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
                    placeholder="98989 98989"
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
                    placeholder="Postcode / Zip"
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
