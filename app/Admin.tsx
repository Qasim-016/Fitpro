

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';
import moment from 'moment';
import { SERVER_IP } from './config';
interface GymSchedule {
  day: string;
  startTime: string;
  endTime: string;
  status: string;
}

const Admin = () => {
  const [gymSchedule, setGymSchedule] = useState<GymSchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');  
  const [formData, setFormData] = useState<{ startTime: string; endTime: string; status: string }>({
    startTime: '',
    endTime: '',
    status: '',
  });
  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [data,isdata] = useState(false);

  // Fetch schedule on component mount
  useEffect(() => {
    fetchSchedule();
    const currentDay = moment().format('dddd');
    setSelectedDay(currentDay); // Set current day as selected by default

    // Automatically set selectedStatus based on the selected day and current status
    const currentStatus = gymSchedule.find((schedule) => schedule.day === currentDay)?.status;
    if (currentStatus) {
      // If gym is Open, set status to 'Closed'
      setSelectedStatus(currentStatus === 'The gym is Opened' ? 'The gym is Closed' : 'The gym is Opened');
    } else {
      setSelectedStatus(''); // Default if no status found
    }
  }, [gymSchedule]); // Dependency on gymSchedule

  // Fetch gym schedule from backend
  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`http://${SERVER_IP}:5000/api/gym-schedule`);
      setGymSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      alert('Failed to fetch schedule. Please check the server.');
    }
  };

    // Validate time format and range
  const isValidTimeRange = (startTime: string, endTime: string): boolean => {
    const start = moment(startTime, 'hh:mm A');
    const end = moment(endTime, 'hh:mm A');

    if (!start.isValid() || !end.isValid()) {
      alert('Please enter valid times in the format "hh:mm AM/PM".');
      return false;
    }

    if (!start.isBefore(end)) {
      alert('End time must be greater than start time.');
      return false;
    }

    return true;
  };
  // Handle start time and check with current time
  const handleStartTimeCheck = () => {
    const currentTime = moment().format('hh:mm A');
    const startTime = moment(formData.startTime, 'hh:mm A').format('hh:mm A');

    if (!validateTimeFormat(formData.startTime)) {
      alert('Please enter a valid time in the format "hh:mm AM/PM".');
      return;
    }

    if (startTime === currentTime) {
      handleUpdate();
    } else {
      alert(`The status will be updated when it matches the current time (${currentTime}).`);
      const checkTimeInterval = setInterval(() => {
        const currentTime = moment().format('hh:mm A');
        if (startTime === currentTime) {
          handleUpdate();
          clearInterval(checkTimeInterval);
        }
      }, 6000); // Check every minute
    }
  };

  // Update schedule for a specific day
  const handleUpdate = async () => {
    if (!selectedDay) {
      alert('Please select a day to update.');
      return;
    }
    if (!isValidTimeRange(formData.startTime, formData.endTime)) {
            return;
          }

    if (!selectedStatus) {
      alert('Please select a status (Open or Closed).');
      return;
    }

    try {
      const updatedData = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: selectedStatus,
      };

      await axios.put(`http://${SERVER_IP}:5000/api/gym-schedule/${selectedDay}`, updatedData);

      alert('Schedule updated successfully!');
      fetchSchedule(); // Refresh schedule after update
       const endTime = moment(formData.endTime, 'hh:mm A');
      const currentTime = moment();

      if (endTime.isAfter(currentTime)) {
        const timeout = endTime.diff(currentTime);

        setTimeout(async () => {
          try {
            await axios.put(`http://${SERVER_IP}:5000/api/gym-schedule/${selectedDay}`, {
              startTime: '-',
              endTime: '-',
              status: 'The gym is Closed',
            });
            alert(`Gym automatically closed for ${selectedDay}`);
            fetchSchedule();
          } catch (error) {
            console.error('Error auto-closing gym:', error);
          }
        }, timeout);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to update schedule. Please try again.');
    }
  };

  // Handle input changes
  const handleChange = (text: string, field: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: text,
    }));
  };

  // Open modal for status selection
  const openStatusSelection = () => {
    setIsStatusModalVisible(true);
  };

  // Close status modal
  const closeStatusModal = () => {
    setIsStatusModalVisible(false);
  };

  // Time format validation function
  const validateTimeFormat = (time: string): boolean => {
    const timePattern = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
    return timePattern.test(time);
  };

  // Update status dropdown options based on current gym status
  const getStatusOptions = (): string[] => {
    // Status is dynamically set already, so return the opposite status
    return selectedStatus === 'The gym is Opened'
      ? ['The gym is Closed']
      : ['The gym is Opened'];
  };

  return (
    <ScrollView contentContainerStyle={styling.admincontainer}>
      <Text style={styling.admintitle}>Admin Panel - Gym Schedule</Text>

      <View style={styling.admintable}>
        {gymSchedule.map((schedule: GymSchedule) => (
          <View key={schedule.day} style={styling.admintableRow}>
            <Text>{schedule.day}</Text>
            <Text>{schedule.startTime}</Text>
            <Text>{schedule.endTime}</Text>
            <Text>{schedule.status}</Text>
          </View>
        ))}
      </View>

      <Text style={styling.adminsubTitle}>Update Schedule</Text>

      <View style={styling.admininputGroup}>
        <Text>Select Day:</Text>
        <TouchableOpacity style={styling.admindropdown} disabled={true}>
          <Text>{selectedDay || 'Select a day'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day selection modal */}
      <Modal visible={isDayModalVisible} animationType="slide" transparent={true}>
        <View style={styling.adminmodalContainer}>
          <View style={styling.adminmodalContent}>
            <Text style={styling.adminmodalTitle}>Select a Day</Text>
            {gymSchedule.map((day) => (
              <TouchableOpacity
                key={day.day}
                style={[styling.adminmodalItem, selectedDay === day.day && { backgroundColor: '#ddd' }]}
                onPress={() => {}}
                disabled={true} // Disable all days except the current day
              >
                <Text>{day.day}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styling.admincloseButton} onPress={closeStatusModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styling.admininputGroup}>
        <Text>Start Time:</Text>
        <TextInput
          style={styling.admininput}
          placeholder="e.g., 6:00 AM"
          value={formData.startTime}
          onChangeText={(text) => handleChange(text, 'startTime')}
        />
      </View>

      <View style={styling.admininputGroup}>
        <Text>End Time:</Text>
        <TextInput
          style={styling.admininput}
          placeholder="e.g., 10:00 PM"
          value={formData.endTime}
          onChangeText={(text) => handleChange(text, 'endTime')}
        />
      </View>

      <View style={styling.admininputGroup}>
        <Text>Status:</Text>
        <TouchableOpacity style={styling.admindropdown} onPress={openStatusSelection}>
          <Text>{selectedStatus || 'Select status'}</Text>
        </TouchableOpacity>
      </View>

      {/* Status selection modal */}
      <Modal visible={isStatusModalVisible} animationType="slide" transparent={true}>
        <View style={styling.adminmodalContainer}>
          <View style={styling.adminmodalContent}>
            <Text style={styling.adminmodalTitle}>Select Status</Text>
            {getStatusOptions().map((status) => (
              <TouchableOpacity
                key={status}
                style={styling.adminmodalItem}
                onPress={() => {
                  setSelectedStatus(status);
                  closeStatusModal();
                }}
              >
                <Text>{status}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styling.admincloseButton} onPress={closeStatusModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MyButton title="Update Schedule" onPress={handleStartTimeCheck} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
    </ScrollView>
  );
};



export default Admin;
