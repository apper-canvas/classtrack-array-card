import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { parentService } from "@/services/api/parentService";
import { communicationService } from "@/services/api/communicationService";
import { toast } from "react-toastify";

const ParentContactModal = ({ isOpen, onClose, student = null }) => {
  const [parentData, setParentData] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: ""
  });
  const [communications, setCommunications] = useState([]);
  const [newCommunication, setNewCommunication] = useState({
    type: "phone",
    subject: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      loadParentData();
      loadCommunications();
    }
  }, [student, isOpen]);

  const loadParentData = () => {
    if (student) {
      setParentData({
        parentName: student.parentName || "",
        parentEmail: student.parentEmail || "",
        parentPhone: student.parentPhone || ""
      });
    }
  };

  const loadCommunications = async () => {
    if (student) {
      try {
        const data = await communicationService.getByStudentId(student.Id);
        setCommunications(data);
      } catch (err) {
        toast.error("Failed to load communication history");
      }
    }
  };

  const handleParentDataChange = (field, value) => {
    setParentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCommunicationChange = (field, value) => {
    setNewCommunication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveParentData = async () => {
    try {
      setLoading(true);
      await parentService.updateParent(student.Id, parentData);
      toast.success("Parent information updated successfully");
    } catch (err) {
      toast.error("Failed to update parent information");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunication = async (e) => {
    e.preventDefault();
    if (!newCommunication.subject.trim()) {
      toast.error("Subject is required");
      return;
    }

    try {
      setLoading(true);
      const communication = {
        studentId: student.Id,
        type: newCommunication.type,
        subject: newCommunication.subject,
        notes: newCommunication.notes,
        date: new Date().toISOString()
      };
      
      await communicationService.create(communication);
      toast.success("Communication logged successfully");
      setNewCommunication({ type: "phone", subject: "", notes: "" });
      setShowAddForm(false);
      loadCommunications();
    } catch (err) {
      toast.error("Failed to log communication");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "phone": return "Phone";
      case "email": return "Mail";
      case "meeting": return "Users";
      case "message": return "MessageSquare";
      default: return "MessageCircle";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "phone": return "text-blue-600";
      case "email": return "text-green-600";
      case "meeting": return "text-purple-600";
      case "message": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !student) return null;

  const communicationTypes = [
    { value: "phone", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "message", label: "Message" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-600 bg-opacity-75"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Parent Contact - {student.firstName} {student.lastName}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Parent Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Parent Information</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveParentData}
                    disabled={loading}
                  >
                    <ApperIcon name="Save" size={16} />
                    Save
                  </Button>
                </div>
                
                <FormField
                  label="Parent Name"
                  name="parentName"
                  value={parentData.parentName}
                  onChange={handleParentDataChange}
                />
                
                <FormField
                  label="Email"
                  name="parentEmail"
                  type="email"
                  value={parentData.parentEmail}
                  onChange={handleParentDataChange}
                />
                
                <FormField
                  label="Phone"
                  name="parentPhone"
                  value={parentData.parentPhone}
                  onChange={handleParentDataChange}
                />

                {/* Quick Contact Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`tel:${parentData.parentPhone}`)}
                    disabled={!parentData.parentPhone}
                  >
                    <ApperIcon name="Phone" size={16} />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`mailto:${parentData.parentEmail}`)}
                    disabled={!parentData.parentEmail}
                  >
                    <ApperIcon name="Mail" size={16} />
                    Email
                  </Button>
                </div>
              </div>

              {/* Communication History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <ApperIcon name="Plus" size={16} />
                    Log Communication
                  </Button>
                </div>

                {/* Add Communication Form */}
                {showAddForm && (
                  <Card className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <form onSubmit={handleAddCommunication} className="space-y-3">
                        <FormField
                          label="Type"
                          name="type"
                          type="select"
                          value={newCommunication.type}
                          onChange={handleCommunicationChange}
                          options={communicationTypes}
                        />
                        
                        <FormField
                          label="Subject"
                          name="subject"
                          value={newCommunication.subject}
                          onChange={handleCommunicationChange}
                          placeholder="Brief description of communication"
                          required
                        />
                        
                        <FormField
                          label="Notes"
                          name="notes"
                          type="textarea"
                          value={newCommunication.notes}
                          onChange={handleCommunicationChange}
                          placeholder="Additional details (optional)"
                        />
                        
                        <div className="flex space-x-2">
                          <Button type="submit" variant="primary" size="sm" disabled={loading}>
                            <ApperIcon name="Save" size={16} />
                            Save
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowAddForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Timeline */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {communications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="MessageCircle" size={32} className="mx-auto mb-2 text-gray-400" />
                      <p>No communication history yet</p>
                      <p className="text-sm">Start by logging your first interaction</p>
                    </div>
                  ) : (
                    communications.map((comm) => (
                      <div key={comm.Id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`flex-shrink-0 ${getTypeColor(comm.type)}`}>
                          <ApperIcon name={getTypeIcon(comm.type)} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {comm.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(comm.date)}
                            </p>
                          </div>
                          {comm.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              {comm.notes}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            {comm.type}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParentContactModal;