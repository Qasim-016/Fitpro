

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';
import moment from 'moment';

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
      const response = await axios.get('http://192.168.0.114:5000/api/gym-schedule');
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
      }, 60000); // Check every minute
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

      await axios.put(`http://192.168.0.114:5000/api/gym-schedule/${selectedDay}`, updatedData);

      alert('Schedule updated successfully!');
      fetchSchedule(); // Refresh schedule after update
       const endTime = moment(formData.endTime, 'hh:mm A');
      const currentTime = moment();

      if (endTime.isAfter(currentTime)) {
        const timeout = endTime.diff(currentTime);

        setTimeout(async () => {
          try {
            await axios.put(`http://192.168.0.114:5000/api/gym-schedule/${selectedDay}`, {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Panel - Gym Schedule</Text>

      <View style={styles.table}>
        {gymSchedule.map((schedule: GymSchedule) => (
          <View key={schedule.day} style={styles.tableRow}>
            <Text>{schedule.day}</Text>
            <Text>{schedule.startTime}</Text>
            <Text>{schedule.endTime}</Text>
            <Text>{schedule.status}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subTitle}>Update Schedule</Text>

      <View style={styles.inputGroup}>
        <Text>Select Day:</Text>
        <TouchableOpacity style={styles.dropdown} disabled={true}>
          <Text>{selectedDay || 'Select a day'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day selection modal */}
      <Modal visible={isDayModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Day</Text>
            {gymSchedule.map((day) => (
              <TouchableOpacity
                key={day.day}
                style={[styles.modalItem, selectedDay === day.day && { backgroundColor: '#ddd' }]}
                onPress={() => {}}
                disabled={true} // Disable all days except the current day
              >
                <Text>{day.day}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={closeStatusModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.inputGroup}>
        <Text>Start Time:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 6:00 AM"
          value={formData.startTime}
          onChangeText={(text) => handleChange(text, 'startTime')}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>End Time:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 10:00 PM"
          value={formData.endTime}
          onChangeText={(text) => handleChange(text, 'endTime')}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>Status:</Text>
        <TouchableOpacity style={styles.dropdown} onPress={openStatusSelection}>
          <Text>{selectedStatus || 'Select status'}</Text>
        </TouchableOpacity>
      </View>

      {/* Status selection modal */}
      <Modal visible={isStatusModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Status</Text>
            {getStatusOptions().map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedStatus(status);
                  closeStatusModal();
                }}
              >
                <Text>{status}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={closeStatusModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MyButton title="Update Schedule" onPress={handleStartTimeCheck} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  dropdown: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#ccc',
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Admin;














// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
// import styling from '@/assets/Styles/styling';
// import MyButton from '@/components/Buttons/MyButton';
// import moment from 'moment';

// interface GymSchedule {
//   day: string;
//   startTime: string;
//   endTime: string;
//   status: string;
// }

// const Admin = () => {
//   const [gymSchedule, setGymSchedule] = useState<GymSchedule[]>([]);
//   const [selectedDay, setSelectedDay] = useState<string>('');
//   const [selectedStatus, setSelectedStatus] = useState<string>('');  
//   const [formData, setFormData] = useState<{ startTime: string; endTime: string; status: string }>({
//     startTime: '',
//     endTime: '',
//     status: '',
//   });
//   const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

//   // Fetch schedule on component mount
//   useEffect(() => {
//     fetchSchedule();
//     const currentDay = moment().format('dddd');
//     setSelectedDay(currentDay);
//   }, []);

//   // Fetch gym schedule from backend
//   const fetchSchedule = async () => {
//     try {
//       const response = await axios.get('http://192.168.0.115:5000/api/gym-schedule');
//       setGymSchedule(response.data);
//     } catch (error) {
//       console.error('Error fetching schedule:', error);
//       alert('Failed to fetch schedule. Please check the server.');
//     }
//   };

//   // Validate time format and range
//   const isValidTimeRange = (startTime: string, endTime: string): boolean => {
//     const start = moment(startTime, 'hh:mm A');
//     const end = moment(endTime, 'hh:mm A');

//     if (!start.isValid() || !end.isValid()) {
//       alert('Please enter valid times in the format "hh:mm AM/PM".');
//       return false;
//     }

//     if (!start.isBefore(end)) {
//       alert('End time must be greater than start time.');
//       return false;
//     }

//     return true;
//   };

//   // Handle update
//   const handleUpdate = async () => {
//     if (!selectedDay) {
//       alert('Please select a day to update.');
//       return;
//     }

//     if (!isValidTimeRange(formData.startTime, formData.endTime)) {
//       return;
//     }

//     if (!selectedStatus) {
//       alert('Please select a status (Open or Closed).');
//       return;
//     }

//     try {
//       const updatedData = {
//         startTime: formData.startTime,
//         endTime: formData.endTime,
//         status: selectedStatus,
//       };

//       await axios.put(`http://192.168.0.115:5000/api/gym-schedule/${selectedDay}`, updatedData);
//       alert('Schedule updated successfully!');
//       fetchSchedule(); // Refresh schedule after update

//       // Monitor end time and auto-close gym
//       const endTime = moment(formData.endTime, 'hh:mm A');
//       const currentTime = moment();

//       if (endTime.isAfter(currentTime)) {
//         const timeout = endTime.diff(currentTime);

//         setTimeout(async () => {
//           try {
//             await axios.put(`http://192.168.0.115:5000/api/gym-schedule/${selectedDay}`, {
//               startTime: '-',
//               endTime: '-',
//               status: 'The gym is Closed',
//             });
//             alert(`Gym automatically closed for ${selectedDay}`);
//             fetchSchedule();
//           } catch (error) {
//             console.error('Error auto-closing gym:', error);
//           }
//         }, timeout);
//       }
//     } catch (error) {
//       console.error('Error updating schedule:', error);
//       alert('Failed to update schedule. Please try again.');
//     }
//   };

//   const handleChange = (text: string, field: string) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: text,
//     }));
//   };

//   const openStatusSelection = () => {
//     setIsStatusModalVisible(true);
//   };

//   const closeStatusModal = () => {
//     setIsStatusModalVisible(false);
//   };

//   const getStatusOptions = (): string[] => {
//     return ['The gym is Opened', 'The gym is Closed'];
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Admin Panel - Gym Schedule</Text>

//       <View style={styles.table}>
//         {gymSchedule.map((schedule: GymSchedule) => (
//           <View key={schedule.day} style={styles.tableRow}>
//             <Text>{schedule.day}</Text>
//             <Text>{schedule.startTime}</Text>
//             <Text>{schedule.endTime}</Text>
//             <Text>{schedule.status}</Text>
//           </View>
//         ))}
//       </View>

//       <Text style={styles.subTitle}>Update Schedule</Text>

//       <View style={styles.inputGroup}>
//         <Text>Start Time:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g., 6:00 AM"
//           value={formData.startTime}
//           onChangeText={(text) => handleChange(text, 'startTime')}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text>End Time:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g., 10:00 PM"
//           value={formData.endTime}
//           onChangeText={(text) => handleChange(text, 'endTime')}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text>Status:</Text>
//         <TouchableOpacity style={styles.dropdown} onPress={openStatusSelection}>
//           <Text>{selectedStatus || 'Select status'}</Text>
//         </TouchableOpacity>
//       </View>

//       <Modal visible={isStatusModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Status</Text>
//             {getStatusOptions().map((status) => (
//               <TouchableOpacity
//                 key={status}
//                 style={styles.modalItem}
//                 onPress={() => {
//                   setSelectedStatus(status);
//                   closeStatusModal();
//                 }}
//               >
//                 <Text>{status}</Text>
//               </TouchableOpacity>
//             ))}
//             <TouchableOpacity style={styles.closeButton} onPress={closeStatusModal}>
//               <Text>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <MyButton title="Update Schedule" onPress={handleUpdate} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   table: {
//     marginBottom: 20,
//   },
//   tableHeader: {
//     fontWeight: 'bold',
//     marginVertical: 5,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   subTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     paddingLeft: 8,
//   },
//   dropdown: {
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderColor: 'gray',
//     borderWidth: 1,
//     paddingHorizontal: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
//   modalItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'gray',
//   },
//   closeButton: {
//     padding: 10,
//     backgroundColor: '#ccc',
//     marginTop: 20,
//     alignItems: 'center',
//   },
// });

// export default Admin;


