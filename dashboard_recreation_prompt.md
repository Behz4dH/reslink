# Dashboard and Pitch Feature Recreation Prompt

## Project Overview
This is a detailed JSON prompt to recreate the **PitchCraft MVP** dashboard and its integrated pitch generation feature based on the analyzed design images and existing codebase.

## JSON Prompt for Complete Dashboard Recreation

```json
{
  "project_name": "PitchCraft MVP Dashboard",
  "description": "Recreate the complete dashboard interface for an AI-powered pitch generation and teleprompter tool with exact design specifications",
  "tech_stack": {
    "frontend": "React 18 + TypeScript + Tailwind CSS + Vite",
    "backend": "Node.js + Express + TypeScript",
    "ai_integration": "OpenAI API (GPT-3.5-turbo)",
    "video": "WebRTC for browser-based recording"
  },
  "design_specifications": {
    "layout": {
      "type": "dashboard_with_sidebar",
      "sidebar_width": "240px",
      "sidebar_background": "#1e3a8a", 
      "main_content_background": "#f8fafc",
      "header_height": "80px"
    },
    "color_palette": {
      "primary_blue": "#1e3a8a",
      "secondary_blue": "#3b82f6", 
      "accent_green": "#84cc16",
      "text_primary": "#1f2937",
      "text_secondary": "#6b7280",
      "background_light": "#f8fafc",
      "background_white": "#ffffff",
      "border_color": "#e5e7eb",
      "red_recording": "#dc2626"
    },
    "typography": {
      "font_family": "Inter, system-ui, sans-serif",
      "heading_sizes": {
        "h1": "text-2xl font-bold",
        "h2": "text-xl font-semibold", 
        "h3": "text-lg font-medium"
      },
      "body_text": "text-sm text-gray-600",
      "button_text": "text-sm font-medium"
    }
  },
  "components": {
    "sidebar": {
      "position": "fixed left-0 top-0",
      "width": "240px",
      "height": "100vh",
      "background": "#1e3a8a",
      "padding": "0",
      "elements": [
        {
          "type": "user_profile",
          "position": "top",
          "padding": "24px",
          "content": {
            "avatar": "rounded-lg bg-blue-500 text-white w-12 h-12 flex items-center justify-center",
            "name": "behzad",
            "role": "Job Seeker",
            "name_color": "#ffffff",
            "role_color": "#94a3b8"
          }
        },
        {
          "type": "navigation_menu",
          "padding": "0 16px",
          "items": [
            {
              "label": "Dashboard",
              "icon": "home",
              "active": true,
              "style": "bg-lime-400 text-gray-900 rounded-lg px-4 py-3 font-medium"
            },
            {
              "label": "Resources", 
              "icon": "document",
              "active": false,
              "style": "text-white hover:bg-blue-800 rounded-lg px-4 py-3"
            },
            {
              "label": "Account settings",
              "icon": "cog",
              "expandable": true,
              "active": false,
              "style": "text-white hover:bg-blue-800 rounded-lg px-4 py-3"
            },
            {
              "label": "Support",
              "icon": "question-mark-circle",
              "expandable": true,
              "active": false,
              "style": "text-white hover:bg-blue-800 rounded-lg px-4 py-3"
            }
          ]
        },
        {
          "type": "referral_section",
          "position": "middle",
          "margin": "32px 16px",
          "background": "#1e40af",
          "border_radius": "12px",
          "padding": "24px",
          "content": {
            "icon": "🎁",
            "title": "GET REWARDED FOR REFERRALS",
            "description": "Refer friends to Reslink and earn credits when they sign up!",
            "link_text": "More details",
            "link_color": "#94a3b8"
          }
        },
        {
          "type": "copy_link_button",
          "margin": "16px",
          "style": "bg-white text-gray-900 rounded-lg px-4 py-3 flex items-center justify-between font-medium",
          "text": "Copy link",
          "icon": "copy"
        },
        {
          "type": "logout_button",
          "position": "bottom",
          "padding": "24px",
          "style": "text-white hover:text-gray-300 flex items-center gap-2",
          "text": "Log out",
          "icon": "arrow-right-on-rectangle"
        }
      ]
    },
    "header": {
      "position": "fixed top-0 right-0",
      "left": "240px",
      "height": "80px",
      "background": "#ffffff",
      "border_bottom": "1px solid #e5e7eb",
      "padding": "0 32px",
      "display": "flex",
      "align_items": "center",
      "justify_content": "space-between",
      "elements": [
        {
          "type": "page_title",
          "text": "CREATE A RESLINK",
          "style": "text-2xl font-bold text-gray-900"
        },
        {
          "type": "action_button",
          "text": "+ New Reslink",
          "style": "bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-lime-500"
        },
        {
          "type": "user_menu",
          "avatar": "w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center",
          "text": "BH"
        }
      ]
    },
    "main_content": {
      "margin_left": "240px",
      "margin_top": "80px",
      "padding": "32px",
      "min_height": "calc(100vh - 80px)",
      "background": "#f8fafc",
      "sections": [
        {
          "type": "progress_steps",
          "layout": "horizontal",
          "margin_bottom": "48px",
          "steps": [
            {
              "number": "1",
              "title": "Title your Reslink", 
              "status": "completed",
              "style": "flex items-center gap-4 text-blue-600"
            },
            {
              "number": "2",
              "title": "Upload Resume",
              "status": "completed", 
              "style": "flex items-center gap-4 text-blue-600"
            },
            {
              "number": "3", 
              "title": "Video pitch",
              "status": "active",
              "style": "flex items-center gap-4 text-blue-600 font-semibold"
            }
          ]
        },
        {
          "type": "pitch_creation_section",
          "title": "CREATE YOUR PITCH",
          "layout": "two_column",
          "gap": "48px",
          "left_column": {
            "type": "video_recording_area",
            "width": "50%",
            "content": {
              "type": "dual_option_layout",
              "options": [
                {
                  "title": "Record a video pitch",
                  "description": "Use our built-in recorder to capture your pitch in minutes.",
                  "icon": "📹",
                  "button": {
                    "text": "Start Recording",
                    "style": "bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700",
                    "action": "open_teleprompter"
                  },
                  "style": "text-center p-8"
                },
                {
                  "title": "Have a custom video? Upload Video", 
                  "description": "Already have a professionally edited video or a custom pitch?",
                  "icon": "⬆️",
                  "button": {
                    "text": "👑 Upgrade to Premium",
                    "style": "bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
                  },
                  "style": "text-center p-8"
                }
              ]
            }
          },
          "navigation_buttons": {
            "previous": {
              "text": "Previous Step",
              "style": "border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
            }
          }
        }
      ]
    },
    "teleprompter_interface": {
      "type": "full_screen_overlay",
      "background": "#f3f4f6",
      "z_index": "50",
      "sections": [
        {
          "type": "header_bar",
          "height": "80px",
          "background": "#ffffff",
          "border_bottom": "1px solid #e5e7eb",
          "padding": "0 24px",
          "content": {
            "left_section": {
              "back_button": {
                "text": "← Back",
                "style": "text-gray-600 hover:text-gray-800"
              },
              "title": {
                "text": "RECORD YOUR PITCH",
                "style": "text-xl font-semibold text-gray-900 ml-4"
              }
            },
            "right_section": {
              "teleprompter_toggle": {
                "label": "Teleprompter",
                "enabled": true,
                "style": "toggle switch bg-blue-600 w-12 h-6 rounded-full relative"
              }
            }
          }
        },
        {
          "type": "main_recording_area", 
          "height": "calc(100vh - 80px)",
          "layout": "flex",
          "sections": [
            {
              "type": "video_recording_panel",
              "width": "flex-1",
              "background": "#f9fafb",
              "content": {
                "video_window": {
                  "width": "500px",
                  "height": "375px",
                  "background": "#000000",
                  "border_radius": "12px",
                  "position": "center",
                  "elements": [
                    {
                      "type": "video_stream",
                      "style": "w-full h-full object-cover transform scaleX(-1)"
                    },
                    {
                      "type": "recording_button",
                      "position": "bottom-center absolute",
                      "margin_bottom": "16px",
                      "style": "w-16 h-16 rounded-full border-4 border-white bg-red-500 hover:bg-red-600"
                    },
                    {
                      "type": "recording_timer",
                      "position": "top-right absolute",
                      "margin": "16px",
                      "style": "bg-red-600 text-white px-3 py-1 rounded-full text-sm",
                      "content": "🔴 1:24",
                      "visible_when": "recording"
                    },
                    {
                      "type": "teleprompter_overlay",
                      "position": "center absolute",
                      "width": "full max-w-md",
                      "height": "150px",
                      "content": {
                        "text_style": "text-white leading-relaxed font-medium text-shadow",
                        "scroll_animation": "transform translateY with linear transition",
                        "font_sizes": {
                          "small": "text-sm",
                          "medium": "text-base", 
                          "large": "text-lg"
                        }
                      }
                    }
                  ]
                },
                "control_buttons": {
                  "position": "below video",
                  "margin_top": "16px",
                  "layout": "center flex gap-3",
                  "buttons": [
                    {
                      "type": "play_pause",
                      "text": "▶️ Play / ⏸️ Pause",
                      "style": "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    },
                    {
                      "type": "reset",
                      "text": "🔄 Reset", 
                      "style": "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    }
                  ]
                }
              }
            },
            {
              "type": "script_sidebar",
              "width": "384px",
              "background": "#ffffff",
              "border_left": "1px solid #e5e7eb",
              "sections": [
                {
                  "type": "sidebar_header",
                  "padding": "24px",
                  "border_bottom": "1px solid #e5e7eb",
                  "content": {
                    "title": "Teleprompter",
                    "description": "Toggle on the teleprompter to display your script while recording."
                  }
                },
                {
                  "type": "script_editor",
                  "flex": "1",
                  "padding": "24px",
                  "content": {
                    "textarea": {
                      "background": "#f9fafb",
                      "border_radius": "8px",
                      "padding": "16px",
                      "height": "full",
                      "placeholder": "Use this space to draft your script and stay on point while recording your video.",
                      "style": "resize-none border-none bg-transparent text-gray-700 text-sm leading-relaxed"
                    }
                  }
                },
                {
                  "type": "controls_panel",
                  "padding": "24px",
                  "border_top": "1px solid #e5e7eb",
                  "controls": [
                    {
                      "type": "font_size_slider",
                      "label": "Font Size",
                      "values": ["14", "16", "18"],
                      "style": "w-full range slider"
                    },
                    {
                      "type": "speed_slider", 
                      "label": "Speed",
                      "range": "1-5",
                      "style": "w-full range slider"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "pitch_ai_modal": {
      "type": "modal_overlay",
      "background": "rgba(0,0,0,0.5)",
      "z_index": "50",
      "content": {
        "modal_window": {
          "width": "600px",
          "background": "#ffffff",
          "border_radius": "12px",
          "position": "center",
          "sections": [
            {
              "type": "modal_header",
              "padding": "24px 24px 0",
              "content": {
                "icon": "⚡",
                "title": "Reslink PitchAI",
                "close_button": "absolute top-4 right-4"
              }
            },
            {
              "type": "job_input_form",
              "padding": "24px",
              "fields": [
                {
                  "type": "text_input",
                  "label": "What is the job title?",
                  "placeholder": "ex. UX/UI Designer",
                  "style": "w-full border border-gray-300 rounded-lg px-3 py-2"
                },
                {
                  "type": "textarea",
                  "label": "Job Description", 
                  "placeholder": "Paste job description here...",
                  "height": "120px",
                  "style": "w-full border border-gray-300 rounded-lg px-3 py-2"
                }
              ]
            },
            {
              "type": "modal_actions",
              "padding": "0 24px 24px",
              "content": {
                "generate_button": {
                  "text": "⚡ Generate",
                  "style": "bg-lime-400 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-lime-500 w-full"
                }
              }
            }
          ]
        }
      }
    },
    "generated_script_modal": {
      "type": "modal_overlay",
      "background": "rgba(0,0,0,0.5)",
      "z_index": "50",
      "content": {
        "modal_window": {
          "width": "700px",
          "background": "#ffffff",
          "border_radius": "12px",
          "position": "center",
          "sections": [
            {
              "type": "modal_header",
              "padding": "24px 24px 0",
              "content": {
                "icon": "⚡",
                "title": "Reslink PitchAI",
                "close_button": "absolute top-4 right-4"
              }
            },
            {
              "type": "script_preview",
              "padding": "24px",
              "content": {
                "intro_text": "Here's a tailored 60-90 second video script for your software developer application, based on your resume and the placeholder job description:",
                "script_text": {
                  "style": "bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 leading-relaxed",
                  "content": "Generated script content with proper formatting and paragraphs"
                }
              }
            },
            {
              "type": "editing_options",
              "padding": "0 24px",
              "layout": "flex gap-2",
              "buttons": [
                {
                  "text": "✂️ Shorten it",
                  "style": "border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
                },
                {
                  "text": "😊 Make it casual", 
                  "style": "border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
                },
                {
                  "text": "📏 Lengthen it",
                  "style": "border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
                },
                {
                  "text": "👔 Make it formal",
                  "style": "border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
                }
              ]
            },
            {
              "type": "custom_input",
              "padding": "24px",
              "content": {
                "input_field": {
                  "placeholder": "✏️ Tell us what you want to change in the script",
                  "style": "w-full border border-gray-300 rounded-lg px-3 py-2"
                }
              }
            },
            {
              "type": "modal_actions",
              "padding": "0 24px 24px",
              "content": {
                "save_button": {
                  "text": "✓ Save",
                  "style": "bg-lime-400 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-lime-500 w-full"
                }
              }
            }
          ]
        }
      }
    }
  },
  "interactions_and_flow": {
    "user_journey": [
      {
        "step": 1,
        "screen": "dashboard_step_1",
        "action": "User fills in Reslink title",
        "ui_state": "Title input field active, step 1 highlighted"
      },
      {
        "step": 2,
        "screen": "dashboard_step_2", 
        "action": "User uploads resume PDF",
        "ui_state": "Upload area active, file preview shown, step 2 highlighted"
      },
      {
        "step": 3,
        "screen": "dashboard_step_3",
        "action": "User chooses to record pitch",
        "ui_state": "Video pitch options displayed, step 3 highlighted"
      },
      {
        "step": 4,
        "screen": "teleprompter_interface",
        "action": "User clicks 'Start Recording'",
        "ui_state": "Full-screen teleprompter interface opens"
      },
      {
        "step": 5,
        "screen": "pitch_ai_modal",
        "action": "User clicks 'Write with PitchAI'",
        "ui_state": "AI prompt modal opens over teleprompter"
      },
      {
        "step": 6,
        "screen": "generated_script_modal",
        "action": "User generates script with AI",
        "ui_state": "Generated script modal with editing options"
      }
    ],
    "key_interactions": {
      "teleprompter_toggle": "Shows/hides teleprompter text overlay on video",
      "recording_button": "Red circle - starts/stops video recording",
      "scroll_controls": "Play/pause/reset buttons control teleprompter scrolling",
      "font_size_slider": "Adjusts teleprompter text size (14px, 16px, 18px)",
      "speed_slider": "Controls scrolling speed (1-5 scale)",
      "pitch_ai_button": "Opens AI script generation modal",
      "script_editing": "Inline editing options in generated script modal"
    }
  },
  "technical_implementation": {
    "required_hooks": [
      "useTeleprompter",
      "useVideoRecording", 
      "usePitchGeneration",
      "useLocalStorage",
      "useMediaDevices"
    ],
    "key_components": [
      "Dashboard",
      "ProgressSteps",
      "PitchCreationSection", 
      "Teleprompter",
      "VideoRecorder",
      "PitchAIModal",
      "ScriptEditor"
    ],
    "state_management": {
      "teleprompter_settings": {
        "fontSize": "small | medium | large",
        "scrollSpeed": "1 | 2 | 3 | 4 | 5",
        "isPlaying": "boolean",
        "currentPosition": "number"
      },
      "recording_state": {
        "isRecording": "boolean",
        "isPaused": "boolean", 
        "duration": "number",
        "videoBlob": "Blob | null"
      },
      "pitch_generation": {
        "script": "string",
        "isGenerating": "boolean",
        "jobTitle": "string",
        "jobDescription": "string"
      }
    }
  },
  "exact_spacing_measurements": {
    "sidebar_width": "240px",
    "header_height": "80px",
    "main_content_padding": "32px",
    "video_window_size": "500px x 375px",
    "script_sidebar_width": "384px",
    "modal_width": "600px-700px",
    "button_padding": "px-4 py-2 to px-6 py-3",
    "section_gaps": "24px to 48px",
    "border_radius": "8px to 12px",
    "recording_button_size": "64px (w-16 h-16)"
  }
}
```

## Implementation Priority

1. **Dashboard Layout** - Sidebar navigation and main content area
2. **Progress Steps** - Multi-step process indicator
3. **Pitch Creation Section** - Dual-option layout for recording vs upload
4. **Teleprompter Interface** - Full-screen recording environment
5. **AI Integration** - Modal-based script generation
6. **Video Recording** - WebRTC implementation with overlay controls

## Key Design Details Observed

- **Color Scheme**: Navy blue sidebar (#1e3a8a) with lime green accents (#84cc16)
- **Navigation**: Active dashboard item highlighted in lime green
- **Video Interface**: 500x375px video window with rounded corners
- **Teleprompter**: White text with shadow overlay on video
- **Recording Controls**: Red circular button (64px) with white icon
- **Modal System**: Layered modals for AI script generation
- **Responsive Layout**: Fixed sidebar with fluid main content

This JSON prompt captures every visual detail, interaction pattern, and technical specification needed to recreate the dashboard and pitch feature exactly as shown in the design images.