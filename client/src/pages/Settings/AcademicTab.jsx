// components/settings/AcademicTab.jsx
import React, { useState, useEffect } from "react";
import { Building, GraduationCap, UserCircle, Calendar, Award, Save, Edit, Loader2 } from "lucide-react";
import { academicService } from "../../utils/academicService";

const AcademicTab = ({ darkMode }) => {
  const [academicData, setAcademicData] = useState({
    instituteName: "",
    branch: "",
    urnNumber: "",
    currentYear: "",
    currentSemester: "",
    gradingSystem: "",
    currentGPA: "",
    totalCredits: "",
    expectedGraduationDate: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const inputClass = `group relative w-full px-4 py-3.5 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 placeholder:transition-colors ${
    darkMode
      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 hover:bg-slate-800/70 focus:bg-slate-800/70'
      : 'bg-white/80 border-gray-200/60 text-gray-900 placeholder-gray-500 hover:bg-white focus:bg-white shadow-sm hover:shadow-md'
  } ${editMode ? '' : 'cursor-not-allowed opacity-70'}`;

  const buttonClass = `group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] ${
    darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
  }`;

  const primaryButtonClass = `${buttonClass} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed`;

  const secondaryButtonClass = `${buttonClass} ${
    darkMode 
      ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
  }`;

  // Fetch academic data on component mount
  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      const response = await academicService.getAcademicInfo();
  
      if (response.success) {
        setAcademicData({
          instituteName: response.data.instituteName || "",
          branch: response.data.branch || "",
          urnNumber: response.data.urnNumber || "",
          currentYear: response.data.currentYear?.toString() || "",
          currentSemester: response.data.currentSemester?.toString() || "",
          gradingSystem: response.data.gradingSystem || "",
          currentGPA: response.data.currentGPA?.toString() || "",
          totalCredits: response.data.totalCredits?.toString() || "",
          expectedGraduationDate: response.data.expectedGraduationDate 
            ? new Date(response.data.expectedGraduationDate).toISOString().split('T')[0] 
            : ""
        });
  
        setEditMode(false); // Start in view mode when data exists
      } else {
        setEditMode(true); // No data found → let them fill it
      }
    } catch (error) {
      console.error('Error fetching academic data:', error);
      setMessage({ type: 'error', text: 'Failed to load academic information' });
      setEditMode(true); // Allow editing if fetch fails
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAcademicData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!academicData.instituteName.trim()) {
      newErrors.instituteName = "Institute name is required";
    }
    
    if (!academicData.branch.trim()) {
      newErrors.branch = "Branch/Department is required";
    }
    
    if (!academicData.urnNumber.trim()) {
      newErrors.urnNumber = "URN/Roll Number is required";
    }
    
    if (!academicData.currentYear) {
      newErrors.currentYear = "Current year is required";
    }
    
    if (!academicData.currentSemester) {
      newErrors.currentSemester = "Current semester is required";
    }
    
    if (!academicData.gradingSystem) {
      newErrors.gradingSystem = "Grading system is required";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setSaving(true);
      setErrors({});
      setMessage({ type: '', text: '' });

      const submitData = {
        ...academicData,
        currentYear: parseInt(academicData.currentYear),
        currentSemester: parseInt(academicData.currentSemester),
        currentGPA: academicData.currentGPA ? parseFloat(academicData.currentGPA) : undefined,
        totalCredits: academicData.totalCredits ? parseInt(academicData.totalCredits) : undefined,
        expectedGraduationDate: academicData.expectedGraduationDate || undefined
      };

      console.log("Submitting academic data:", submitData);

      const response = await academicService.upsertAcademicInfo(submitData);

      console.log("Response from backend:", response);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Academic information saved successfully!' });
        setEditMode(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to save academic information' });
      }
    } catch (error) {
      console.error('Error saving academic data:', error);
      setMessage({ type: 'error', text: 'Failed to save academic information' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event bubbling
    setEditMode(true);
    setMessage({ type: '', text: '' });
    setErrors({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setErrors({});
    setMessage({ type: '', text: '' });
    fetchAcademicData(); // Reset to original data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className={`ml-2 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          Loading academic information...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        } ${darkMode && message.type === 'success' ? 'bg-green-900/20 text-green-300 border-green-800' : ''}
        ${darkMode && message.type === 'error' ? 'bg-red-900/20 text-red-300 border-red-800' : ''}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <Building className="w-4 h-4" />
                <span>Institute Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="instituteName"
                value={academicData.instituteName}
                onChange={handleInputChange}
                className={inputClass} 
                placeholder="Enter your institute name"
                disabled={!editMode}
              />
              {errors.instituteName && (
                <p className="text-red-500 text-xs mt-1">{errors.instituteName}</p>
              )}
            </div>

            <div>
              <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <GraduationCap className="w-4 h-4" />
                <span>Branch/Department</span>
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="branch"
                value={academicData.branch}
                onChange={handleInputChange}
                className={inputClass} 
                placeholder="e.g., Computer Science Engineering"
                disabled={!editMode}
              />
              {errors.branch && (
                <p className="text-red-500 text-xs mt-1">{errors.branch}</p>
              )}
            </div>

            <div>
              <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <UserCircle className="w-4 h-4" />
                <span>URN/Roll Number</span>
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="urnNumber"
                value={academicData.urnNumber}
                onChange={handleInputChange}
                className={inputClass} 
                placeholder="Enter your unique registration number"
                disabled={!editMode}
              />
              {errors.urnNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.urnNumber}</p>
              )}
            </div>

            <div>
              <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <Award className="w-4 h-4" />
                <span>Current GPA</span>
              </label>
              <input 
                type="number" 
                name="currentGPA"
                value={academicData.currentGPA}
                onChange={handleInputChange}
                className={inputClass} 
                placeholder="Enter current GPA (optional)"
                step="0.01"
                min="0"
                max="10"
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                  darkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>Current Year</span>
                  <span className="text-red-500">*</span>
                </label>
                <select 
                  name="currentYear"
                  value={academicData.currentYear}
                  onChange={handleInputChange}
                  className={inputClass}
                  disabled={!editMode}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                {errors.currentYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentYear}</p>
                )}
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                  darkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>Current Semester</span>
                  <span className="text-red-500">*</span>
                </label>
                <select 
                  name="currentSemester"
                  value={academicData.currentSemester}
                  onChange={handleInputChange}
                  className={inputClass}
                  disabled={!editMode}
                >
                  <option value="">Select Semester</option>
                  {[...Array(8)].map((_, i) => (
                    <option key={i} value={i + 1}>{`Semester ${i + 1}`}</option>
                  ))}
                </select>
                {errors.currentSemester && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentSemester}</p>
                )}
              </div>
            </div>

            <div>
              <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <Award className="w-4 h-4" />
                <span>Grading System</span>
                <span className="text-red-500">*</span>
              </label>
              <select 
                name="gradingSystem"
                value={academicData.gradingSystem}
                onChange={handleInputChange}
                className={inputClass}
                disabled={!editMode}
              >
                <option value="">Select Grading System</option>
                <option value="cgpa">CGPA (10 Point Scale)</option>
                <option value="gpa">GPA (4 Point Scale)</option>
                <option value="percentage">Percentage</option>
              </select>
              {errors.gradingSystem && (
                <p className="text-red-500 text-xs mt-1">{errors.gradingSystem}</p>
              )}
            </div>

            <div>
              <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <Award className="w-4 h-4" />
                <span>Total Credits</span>
              </label>
              <input 
                type="number" 
                name="totalCredits"
                value={academicData.totalCredits}
                onChange={handleInputChange}
                className={inputClass} 
                placeholder="Enter total credits (optional)"
                min="0"
                disabled={!editMode}
              />
            </div>

            <div>
              <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <Calendar className="w-4 h-4" />
                <span>Expected Graduation</span>
              </label>
              <input 
                type="date" 
                name="expectedGraduationDate"
                value={academicData.expectedGraduationDate}
                onChange={handleInputChange}
                className={inputClass}
                disabled={!editMode}
              />
            </div>
          </div>
        </div>

        <div className={`pt-8 border-t ${darkMode ? 'border-slate-700/30' : 'border-gray-200/30'}`}>
          <div className="flex items-center gap-4">
            {editMode ? (
              <>
                <button 
                  type="submit" 
                  className={primaryButtonClass}
                  disabled={saving}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Academic Information'}</span>
                  </span>
                  <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className={secondaryButtonClass}
                  disabled={saving}
                >
                  <span className="relative z-10">Cancel</span>
                </button>
              </>
            ) : (
              <button 
                type="button" 
                onClick={handleEdit}
                className={primaryButtonClass}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Academic Information</span>
                </span>
                <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AcademicTab;