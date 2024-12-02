import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import MyButton from '@/components/Buttons/MyButton';
import PlaceHolderHeading from '@/components/PlaceHolder/PlaceHolderHeading';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    Name: '',
    phoneNumber: '',
    accountNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
  });

  const [errors, setErrors] = useState({
    Name: '',
    phoneNumber: '',
    accountNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
  });

  const [paymentMethodDropdownVisible, setPaymentMethodDropdownVisible] = useState(false);
  const [planDropdownVisible, setPlanDropdownVisible] = useState(false);

  const amounts = [
    { label: '1 Month / 1500', value: '1500' },
    { label: '3 Months / 4200', value: '4200' },
    { label: '6 Months / 8300', value: '8300' },
    { label: '1 Year / 16500', value: '16500' },
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
  
    // Name validation
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required.';
      valid = false;
    } else {
      newErrors.Name = ''; // Clear previous error
    }
  
    // Plan validation
    if (!formData.amount) {
      newErrors.amount = 'Please select a plan.';
      valid = false;
    } else {
      newErrors.amount = ''; // Clear previous error
    }
  
    // Easypaisa Card-specific validation
    if (paymentMethod === 'easypaisaCard') {
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Card number is required.';
        valid = false;
      } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.accountNumber.trim())) {
        newErrors.accountNumber = 'Card number must be in the format XXXX XXXX XXXX XXXX.';
        valid = false;
      } else {
        newErrors.accountNumber = ''; // Clear previous error
      }
  
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required.';
        valid = false;
      } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate.trim())) {
        newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
        valid = false;
      } else {
        newErrors.expiryDate = ''; // Clear previous error
      }
  
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required.';
        valid = false;
      } else if (!/^\d{3}$/.test(formData.cvv.trim())) {
        newErrors.cvv = 'CVV must be a 3-digit number.';
        valid = false;
      } else {
        newErrors.cvv = ''; // Clear previous error
      }
    }
  
    // Easypaisa Account-specific validation
    if (paymentMethod === 'easypaisaAccount') {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required.';
        valid = false;
      } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Phone number must be a valid 10-digit number.';
        valid = false;
      } else {
        newErrors.phoneNumber = ''; // Clear previous error
      }
    }
  
    setErrors(newErrors);
    return valid;
  };
  

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form Submitted Successfully:', formData);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Payment Method Dropdown */}
      <PlaceHolderHeading title="Payment Method" />
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setPaymentMethodDropdownVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {paymentMethod || 'Select Payment Method'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={paymentMethodDropdownVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setPaymentMethod('easypaisaCard');
                setPaymentMethodDropdownVisible(false);
              }}
            >
              <Text style={styles.optionText}>Easypaisa Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setPaymentMethod('easypaisaAccount');
                setPaymentMethodDropdownVisible(false);
              }}
            >
              <Text style={styles.optionText}>Easypaisa Mobile Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPaymentMethodDropdownVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Show Fields Based on Payment Method */}
      {paymentMethod === 'easypaisaCard' && (
        <>
          <PlaceHolderHeading title="Name" />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.Name}
            onChangeText={(text) => setFormData({ ...formData, Name: text })}
          />
          {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

          <PlaceHolderHeading title="Card Number" />
          <TextInput
            style={styles.input}
            placeholder="XXXX XXXX XXXX XXXX"
            value={formData.accountNumber}
            onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
            keyboardType="numeric"
          />
          {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

          <PlaceHolderHeading title="Expiry Date (MM/YY)" />
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
            keyboardType="numeric"
          />
          {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}

          <PlaceHolderHeading title="CVV" />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value={formData.cvv}
            onChangeText={(text) => setFormData({ ...formData, cvv: text })}
            secureTextEntry={true}
            keyboardType="numeric"
          />
          {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
        </>
      )}

      {paymentMethod === 'easypaisaAccount' && (
        <>
          <PlaceHolderHeading title="Name" />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.Name}
            onChangeText={(text) => setFormData({ ...formData, Name: text })}
          />
          {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

          <PlaceHolderHeading title="Phone Number" />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            keyboardType="numeric"
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
        </>
      )}

      {/* Plan Dropdown */}
      <PlaceHolderHeading title="Select Plan" />
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setPlanDropdownVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {formData.amount
            ? amounts.find((item) => item.value === formData.amount)?.label
            : 'Select Plan'}
        </Text>
      </TouchableOpacity>

      <Modal visible={planDropdownVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={amounts}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setFormData({ ...formData, amount: item.value });
                    setPlanDropdownVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPlanDropdownVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

      {/* Submit Button */}
      <MyButton
        title={'Submit'}
        style1={styles.submitButton}
        style2={styles.submitButtonText}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,paddingTop:0,
    padding: 20,
    // backgroundColor: '#f4f4f4',
  },input2container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  
  inputWrapper: {
    width: '48%', // Adjusts the width to fit both inputs in one line
  },
  
  input: {
    width:'auto',
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 5,
    paddingHorizontal: 10,
    // marginBottom: 10,
    // backgroundColor: '#fff',
  },
  input2: {
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 5,
    width:'auto',
    paddingHorizontal: 10,
    // marginBottom: 10,
    // backgroundColor: '#2ecc71',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    // marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical:5
    // marginBottom: 10,
    // backgroundColor: '#fff',
  },
  dropdownText: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2ecc71',
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  closeText: {
    color: '#2ecc71',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 5,
    backgroundColor: '#2ecc71',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentForm;




