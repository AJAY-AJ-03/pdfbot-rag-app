import { useState, useEffect, useRef, useCallback, useReducer, useMemo } from "react";
import { 
  Search, Upload, StopCircle, FileText, ChevronDown, X, AlertCircle, 
  CheckCircle, Loader, RefreshCw, Copy, Check, Send, Sparkles, Bot, User, 
  Menu, BookOpen, Zap, Layers, Clock, Star, Globe, MessageSquare,
  FolderTree, Brain, Code, Quote, List, Hash, Link2, Table, Trash2
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, vscDarkPlus, dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Message reducer with functional updates
const messageReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.payload];
    case 'UPDATE_LAST_MESSAGE':
      return state.map((msg, index) => 
        index === state.length - 1 ? { ...msg, content: action.payload } : msg
      );
    case 'REMOVE_LAST_MESSAGE':
      return state.slice(0, -1);
    case 'UPDATE_MESSAGE_BY_ID':
      return state.map(msg => 
        msg.id === action.payload.id ? { ...msg, content: action.payload.content } : msg
      );
    case 'SET_MESSAGES':
      return action.payload;
    default:
      return state;
  }
};

// Toast manager
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

// Code Block with Copy Button - Enhanced Styling
const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-2 sm:my-4">
      <div className="absolute -top-3 left-2 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-600 rounded-full shadow-lg">
        <span className="text-[10px] sm:text-xs font-mono text-white">{language || 'text'}</span>
      </div>
      <button
        onClick={handleCopy}
        className="absolute right-2 sm:right-3 top-2 sm:top-3 p-1.5 sm:p-2 bg-indigo-600/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-700 border border-indigo-400 z-10 shadow-lg"
        aria-label="Copy code"
      >
        {copied ? <Check size={14} className="sm:w-4 sm:h-4 text-emerald-300" /> : <Copy size={14} className="sm:w-4 sm:h-4 text-white" />}
      </button>
      <SyntaxHighlighter
        style={dracula}
        language={language}
        PreTag="div"
        className="rounded-lg sm:rounded-xl !bg-[#1E1E2F] border border-indigo-500/20 text-xs sm:text-sm shadow-2xl"
        customStyle={{ 
          padding: '1.2rem 0.5rem 0.5rem 0.5rem',
          margin: 0,
          borderRadius: '0.5rem'
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, documentName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-96 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl sm:rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Delete Document</h3>
          </div>
          
          <p className="text-sm sm:text-base text-indigo-200 mb-2">
            Are you sure you want to delete this document?
          </p>
          <p className="text-xs sm:text-sm text-indigo-300 bg-indigo-950/50 p-2 rounded-lg mb-4 truncate">
            {documentName}
          </p>
          <p className="text-xs text-indigo-300/70 mb-5">
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-indigo-800/50 hover:bg-indigo-700/50 text-indigo-200 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Mobile Menu Component - Redesigned
const MobileMenu = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-indigo-900/20 backdrop-blur-md z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-64 sm:w-72 bg-gradient-to-b from-indigo-950 to-purple-950 shadow-2xl z-50 lg:hidden animate-in slide-in-from-right border-l border-indigo-800/50">
        <div className="p-4 sm:p-5 border-b border-indigo-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={20} className="sm:w-6 sm:h-6 text-indigo-400" />
              <span className="text-white font-semibold text-sm sm:text-base">Menu</span>
            </div>
            <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-indigo-800/50 rounded-lg transition-colors">
              <X size={18} className="sm:w-5 sm:h-5 text-indigo-300" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          {children}
        </div>
      </div>
    </>
  );
};

// Searchable Select Component - Redesigned with Delete Button
const SearchableSelect = ({ options, value, onChange, placeholder, loading, error, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = useMemo(() => 
    options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    ),
    [options, search]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleDeleteClick = (e, option) => {
    e.stopPropagation();
    setDocumentToDelete(option);
    setShowDeleteConfirm(true);
    setIsOpen(false);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete && onDelete) {
      onDelete(documentToDelete.value, documentToDelete.label);
    }
    setShowDeleteConfirm(false);
    setDocumentToDelete(null);
  };

  return (
    <>
      <div 
        className="relative w-full" 
        ref={dropdownRef}
        onKeyDown={handleKeyDown}
      >
        <button
          onClick={() => !loading && !error && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-sm border rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all ${
            isOpen 
              ? 'border-indigo-400 ring-2 ring-indigo-400/20' 
              : 'border-indigo-700/50 hover:border-indigo-400 hover:bg-indigo-800/50'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${
            error ? 'border-red-400 bg-red-900/30' : ''
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2 truncate">
            {loading ? (
              <>
                <Loader size={14} className="sm:w-4 sm:h-4 animate-spin text-indigo-400" />
                <span className="text-indigo-200 text-xs sm:text-sm">Loading...</span>
              </>
            ) : error ? (
              <>
                <AlertCircle size={14} className="sm:w-4 sm:h-4 text-red-400" />
                <span className="text-red-200 text-xs sm:text-sm">Connection failed</span>
              </>
            ) : (
              <>
                <BookOpen size={14} className={`sm:w-4 sm:h-4 ${selectedOption ? 'text-indigo-400' : 'text-indigo-500/50'}`} />
                <span className={`truncate max-w-[120px] sm:max-w-[180px] ${selectedOption ? 'text-white font-medium' : 'text-indigo-300/70'} text-xs sm:text-sm`}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </>
            )}
          </div>
          <ChevronDown 
            size={16} 
            className={`sm:w-[18px] sm:h-[18px] text-indigo-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && !loading && !error && (
          <div className="absolute z-10 w-full mt-1 sm:mt-2 bg-gradient-to-b from-indigo-900 to-purple-900 border border-indigo-700 rounded-lg sm:rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="p-1.5 sm:p-2 border-b border-indigo-800">
              <div className="relative">
                <Search size={14} className="absolute left-2 sm:left-3 top-2 sm:top-2.5 text-indigo-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-indigo-950/50 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-white placeholder-indigo-400/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div 
              className="max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar p-1 sm:p-2"
              role="listbox"
              ref={listRef}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={`group flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg cursor-pointer transition-all ${
                      index === highlightedIndex 
                        ? 'bg-indigo-700/70 text-white' 
                        : 'hover:bg-indigo-800/50 text-indigo-200'
                    } ${option.value === value ? 'bg-indigo-600 text-white font-medium' : ''}`}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <span 
                      className="block truncate flex-1"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearch("");
                        setHighlightedIndex(-1);
                      }}
                    >
                      {option.label}
                    </span>
                    <button
                      onClick={(e) => handleDeleteClick(e, option)}
                      className="ml-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                      aria-label="Delete document"
                    >
                      <Trash2 size={12} className="text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm text-indigo-300/70 text-center">
                  No documents found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        documentName={documentToDelete?.label || ''}
        isDeleting={false}
      />
    </>
  );
};

// Message Component - Redesigned with unique styling and fixed dimensions during streaming
const Message = ({ message, isStreaming }) => {
  const messageStyles = {
    user: {
      container: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl rounded-tr-none shadow-xl",
      avatar: "bg-gradient-to-br from-amber-400 to-orange-500"
    },
    assistant: {
      container: "bg-gradient-to-r from-slate-800/90 to-indigo-900/90 backdrop-blur-sm text-gray-100 rounded-2xl rounded-tl-none border border-indigo-700/50 shadow-xl",
      avatar: "bg-gradient-to-br from-emerald-400 to-teal-500"
    }
  };

  // Remove cursor during streaming for smoother appearance
  const content = isStreaming ? message.content.replace(/▋$/, '') : message.content;
  const showCursor = isStreaming && !content.endsWith('▋');

  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300 px-1 sm:px-2`}
    >
      <div className={`flex items-start gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"} max-w-[90%] sm:max-w-[85%] lg:max-w-2xl`}>
        {/* Avatar with glow effect - smaller on mobile */}
        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg relative ${
          message.role === "user" 
            ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
            : 'bg-gradient-to-br from-emerald-400 to-teal-500'
        }`}>
          <div className={`absolute inset-0 rounded-lg sm:rounded-xl blur opacity-50 ${
            message.role === "user" ? 'bg-orange-400' : 'bg-emerald-400'
          }`} />
          <div className="relative">
            {message.role === "user" ? (
              <User size={12} className="text-white sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            ) : (
              <Bot size={12} className="text-white sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            )}
          </div>
        </div>

        {/* Message Content - Fixed minimum height to prevent jumping */}
        <div
          className={`relative group px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-4 text-xs sm:text-sm lg:text-base leading-relaxed min-h-[40px] sm:min-h-[60px] ${
            message.role === "user" 
              ? messageStyles.user.container
              : messageStyles.assistant.container
          } ${message.error ? 'border-red-400 bg-red-900/30' : ''}`}
        >
          {message.role === "assistant" ? (
            <div className="prose prose-invert prose-xs sm:prose-sm lg:prose-base max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <CodeBlock language={match[1]}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    ) : (
                      <code className="bg-indigo-950 px-1 py-0.5 rounded text-[10px] sm:text-xs font-mono text-emerald-400 border border-indigo-700" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 sm:mb-3 last:mb-0 text-xs sm:text-sm lg:text-base leading-relaxed text-gray-200">{children}</p>;
                  },
                  h1({ children }) {
                    return <h1 className="text-base sm:text-lg lg:text-xl font-bold mt-3 mb-2 first:mt-0 text-white">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-sm sm:text-base lg:text-lg font-bold mt-3 mb-1.5 first:mt-0 text-white">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-xs sm:text-sm lg:text-base font-semibold mt-2 mb-1.5 first:mt-0 text-white">{children}</h3>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-4 sm:pl-5 mb-2 space-y-1 marker:text-indigo-400">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-4 sm:pl-5 mb-2 space-y-1 marker:text-indigo-400">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="text-xs sm:text-sm lg:text-base leading-relaxed text-gray-200">{children}</li>;
                  },
                  a({ href, children }) {
                    return (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors text-xs sm:text-sm"
                      >
                        {children}
                      </a>
                    );
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-indigo-500 pl-3 sm:pl-4 italic text-gray-300 my-2 bg-indigo-950/50 py-1.5 pr-1.5 rounded-r-lg text-xs sm:text-sm">
                        {children}
                      </blockquote>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-2 rounded-lg border border-indigo-800">
                        <table className="min-w-full border-collapse text-xs sm:text-sm">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  thead({ children }) {
                    return <thead className="bg-indigo-950/70 text-white">{children}</thead>;
                  },
                  tbody({ children }) {
                    return <tbody className="bg-indigo-900/30">{children}</tbody>;
                  },
                  tr({ children }) {
                    return <tr className="border-b border-indigo-800 last:border-0">{children}</tr>;
                  },
                  th({ children }) {
                    return <th className="px-2 sm:px-4 py-1.5 sm:py-2.5 text-left font-semibold text-xs sm:text-sm">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="px-2 sm:px-4 py-1.5 sm:py-2.5 text-gray-300 text-xs sm:text-sm">{children}</td>;
                  },
                  hr() {
                    return <hr className="my-2 sm:my-4 border-indigo-800" />;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold text-white text-xs sm:text-sm">{children}</strong>;
                  },
                  em({ children }) {
                    return <em className="italic text-gray-300 text-xs sm:text-sm">{children}</em>;
                  },
                }}
              >
                {content}
              </ReactMarkdown>
              
              {/* Streaming cursor - smooth blinking with word-aware positioning */}
              {showCursor && (
                <span className="inline-flex items-center">
                  <span className="w-[2px] h-3 sm:h-4 bg-emerald-400 animate-pulse-slow ml-0.5" />
                </span>
              )}
              
              {message.error && (
                <button
                  className="mt-1.5 sm:mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-950/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-red-800"
                >
                  <RefreshCw size={10} className="sm:w-3 sm:h-3" />
                  <span className="text-[10px] sm:text-xs">Retry</span>
                </button>
              )}
            </div>
          ) : (
            <span className="text-xs sm:text-sm lg:text-base break-words text-white">{message.content}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Floating Action Button for Quick Actions - Mobile optimized
const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-indigo-800/50 backdrop-blur-sm border border-indigo-600/50 rounded-lg text-indigo-200 hover:bg-indigo-700/50 hover:text-white transition-all hover:scale-105 whitespace-nowrap"
  >
    <Icon size={12} className="sm:w-4 sm:h-4" />
    <span className="text-[10px] sm:text-xs whitespace-nowrap">{label}</span>
  </button>
);

export default function App() {
  const [messageState, dispatch] = useReducer(messageReducer, [
    { 
      id: 'initial', 
      role: "assistant", 
      content: "# 👋 Welcome to **NeoChat**!\n\nYour intelligent PDF companion with a modern twist.\n\n## ✨ What I can do for you:\n\n- 📄 **Summarize** lengthy documents\n- 🔍 **Answer** specific questions\n- 📊 **Extract** key information\n- 💡 **Provide insights** and analysis\n\n---\n\n🚀 **Get started** by uploading a PDF document and asking away!"
    }
  ]);
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [deletingDocument, setDeletingDocument] = useState(false);
  
  const { toasts, addToast, removeToast } = useToast();
  const abortControllerRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const messageContainerRef = useRef(null);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [retryCount]);

  // Auto-scroll to bottom during streaming with smooth behavior
  useEffect(() => {
    if (streamingMessageId) {
      // Use requestAnimationFrame for smoother scrolling
      const scrollFrame = requestAnimationFrame(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "nearest" 
          });
        }
      });
      return () => cancelAnimationFrame(scrollFrame);
    }
  }, [messageState, streamingMessageId]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, []);

  // Drag and drop handlers - FIXED VERSION
  useEffect(() => {
    // Prevent default drag behaviors on the whole document
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Highlight drop zone when dragging over
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy'; // Visual feedback for copy operation
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault(); // CRITICAL: Prevents browser from opening the file
      e.stopPropagation();
      
      // Explicitly tell browser we're handling the drop
      e.dataTransfer.dropEffect = 'copy';
      
      setIsDragging(false);
      
      // Get the dropped files
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        // Check if it's a PDF by both extension and MIME type
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          handleFileUpload(file);
        } else {
          addToast("Only PDF files are allowed", "error");
        }
      }
    };

    // Add event listeners to document to prevent default browser behavior
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      document.addEventListener(eventName, preventDefaults, false);
    });

    // Add event listeners to dropzone
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener('dragenter', handleDragEnter);
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);
    }

    // Cleanup
    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.removeEventListener(eventName, preventDefaults, false);
      });
      
      if (dropZone) {
        dropZone.removeEventListener('dragenter', handleDragEnter);
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      }
    };
  }, [addToast]); // Add addToast to dependency array

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      setConnectionError(false);
      const response = await axios.get(`${API_BASE_URL}/documents`);
      const docs = response.data.documents;
      setDocuments(docs);
      if (docs.length > 0 && !selectedPdf) {
        setSelectedPdf(docs[0].document_id);
      } else if (docs.length === 0) {
        setSelectedPdf("");
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      setConnectionError(true);
      addToast("Failed to connect to server", "error");
    } finally {
      setLoadingDocs(false);
    }
  };

  const deleteDocument = async (documentId, documentName) => {
    try {
      setDeletingDocument(true);
      await axios.delete(`${API_BASE_URL}/delete/${documentId}`);
      
      // Update documents list
      const updatedDocs = documents.filter(doc => doc.document_id !== documentId);
      setDocuments(updatedDocs);
      
      // Clear selected PDF if it was deleted
      if (selectedPdf === documentId) {
        setSelectedPdf(updatedDocs.length > 0 ? updatedDocs[0].document_id : "");
      }
      
      addToast(`"${documentName}" deleted successfully`, "success");
    } catch (error) {
      console.error("Failed to delete document", error);
      addToast("Failed to delete document", "error");
    } finally {
      setDeletingDocument(false);
    }
  };

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSending(false);
    setStreamingMessageId(null);
    addToast("Generation stopped", "info");
  }, [addToast]);

  const retryConnection = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadError(null);

    if (!file.name.endsWith(".pdf")) {
      setUploadError("Only PDF files are allowed");
      addToast("Only PDF files are allowed", "error");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File too large (max 50MB)");
      addToast("File too large (max 50MB)", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );

      await fetchDocuments();
      setSelectedPdf(response.data.document_id);
      setUploadError(null);
      addToast(`"${file.name}" uploaded successfully`, "success");
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Upload failed. Please try again.");
      addToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const sendMessage = async (content = input) => {
    const messageContent = content || input;
    if (!messageContent.trim() || isSending) return;
    if (!selectedPdf && documents.length > 0) {
      addToast("Please select a PDF document first", "error");
      return;
    }

    const userMessage = messageContent;
    setInput("");
    setIsSending(true);

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now() + 1}`;

    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { id: userMessageId, role: "user", content: userMessage } 
    });

    // Add empty assistant message
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { id: assistantMessageId, role: "assistant", content: "" } 
    });
    
    setStreamingMessageId(assistantMessageId);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage,
          document_id: selectedPdf
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Document not found. Please reselect.');
        }
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      
      // Buffer for accumulating chunks
      let buffer = "";
      
      // Track last update time for throttling
      let lastUpdateTime = Date.now();
      const UPDATE_INTERVAL = 30; // ms - controls smoothness
      
      // Track if we're in the middle of a word
      let inWord = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Flush any remaining buffer
          if (buffer) {
            fullText += buffer;
            dispatch({ 
              type: 'UPDATE_MESSAGE_BY_ID', 
              payload: { id: assistantMessageId, content: fullText }
            });
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateTime;
        
        // Check if we should update based on:
        // 1. Time threshold reached, OR
        // 2. Natural language breaks (punctuation, spaces after words), OR
        // 3. Buffer size threshold (for long words without breaks)
        
        const hasNaturalBreak = /[.!?\n]\s*$/.test(buffer) || // End of sentence
                                (/\s$/.test(buffer) && inWord) || // End of word
                                buffer.length > 15; // Force update for long strings
        
        if (timeSinceLastUpdate >= UPDATE_INTERVAL && hasNaturalBreak) {
          fullText += buffer;
          dispatch({ 
            type: 'UPDATE_MESSAGE_BY_ID', 
            payload: { id: assistantMessageId, content: fullText }
          });
          
          buffer = "";
          lastUpdateTime = now;
          inWord = false;
          
          // Small micro-pause to let React render
          await new Promise(resolve => setTimeout(resolve, 5));
        } else {
          // Track if we're in the middle of a word
          inWord = buffer.length > 0 && !/\s$/.test(buffer);
        }
      }

      // Ensure final update with complete message
      dispatch({ 
        type: 'UPDATE_MESSAGE_BY_ID', 
        payload: { id: assistantMessageId, content: fullText }
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        const currentContent = messageState.find(m => m.id === assistantMessageId)?.content || '';
        dispatch({ 
          type: 'UPDATE_MESSAGE_BY_ID', 
          payload: { 
            id: assistantMessageId, 
            content: currentContent + '\n\n_Generation stopped_' 
          }
        });
      } else {
        console.error("Chat error:", error);
        dispatch({ type: 'REMOVE_LAST_MESSAGE' });
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { 
            id: `error-${Date.now()}`,
            role: "assistant", 
            content: `❌ ${error.message || "Sorry, an error occurred. Please try again."}`,
            error: true
          }
        });
        addToast(error.message || "Failed to get response", "error");
      }
    } finally {
      setIsSending(false);
      setStreamingMessageId(null);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const documentOptions = documents.map(doc => ({
    value: doc.document_id,
    label: doc.filename
  }));

  // Quick action handlers
  const quickActions = [
    { icon: Zap, label: "Summarize", action: () => sendMessage("Please summarize this document") },
    { icon: Layers, label: "Key Points", action: () => sendMessage("What are the key points?") },
    { icon: Clock, label: "Quick Overview", action: () => sendMessage("Give me a quick overview") }
  ];

  return (
    <div 
      ref={dropZoneRef}
      className={`h-screen flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 transition-all duration-500 overflow-hidden relative ${
        isDragging ? 'brightness-110' : ''
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-48 sm:w-72 h-48 sm:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-900/40 backdrop-blur-md flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-gradient-to-br from-indigo-800 to-purple-800 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 text-center border-2 border-dashed border-indigo-400 max-w-xs sm:max-w-md transform scale-110 animate-pulse">
            <Upload size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-indigo-300" />
            <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">Drop your PDF here</h3>
            <p className="text-xs sm:text-sm text-indigo-200">File will be uploaded automatically</p>
          </div>
        </div>
      )}

      {/* Toast Notifications - Mobile optimized */}
      <div className="fixed top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-4 lg:left-auto z-50 space-y-2 sm:space-y-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-2xl animate-in slide-in-from-right fade-in border ${
              toast.type === "success" ? "bg-emerald-900/90 text-emerald-100 border-emerald-700 backdrop-blur-sm" :
              toast.type === "error" ? "bg-red-900/90 text-red-100 border-red-700 backdrop-blur-sm" :
              "bg-indigo-900/90 text-indigo-100 border-indigo-700 backdrop-blur-sm"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" /> :
             toast.type === "error" ? <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" /> :
             <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />}
            <span className="text-xs sm:text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-current opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header - Mobile optimized */}
      <header className="flex-shrink-0 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 backdrop-blur-xl border-b border-indigo-800/50 sticky top-0 z-40">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo & Title - Enhanced */}
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/30 transform group-hover:rotate-6 transition-transform duration-300">
                  <Brain size={16} className="text-white sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  NeoChat
                </h1>
                <p className="text-[10px] text-indigo-300/70 hidden lg:block">Intelligent PDF Assistant</p>
              </div>
            </div>

            {/* Desktop Controls - Enhanced */}
            <div className="hidden lg:flex items-center gap-4">
              <SearchableSelect
                options={documentOptions}
                value={selectedPdf}
                onChange={setSelectedPdf}
                placeholder="Select document..."
                loading={loadingDocs}
                error={connectionError}
                onDelete={deleteDocument}
              />

              {/* Upload Button - Desktop Enhanced */}
              <div className="relative">
                <label className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl cursor-pointer transition-all hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 group ${
                  uploading ? 'opacity-75 cursor-not-allowed' : ''
                }`}>
                  {uploading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Upload PDF</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="absolute -bottom-1 left-0 right-0 h-1.5 bg-indigo-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Retry Button - Enhanced */}
              {connectionError && (
                <button
                  onClick={retryConnection}
                  className="flex items-center gap-2 px-5 py-3 bg-red-900/30 text-red-200 rounded-xl hover:bg-red-900/50 transition-all border border-red-700/50"
                >
                  <RefreshCw size={18} />
                  <span className="text-sm font-medium">Retry</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button - Enhanced */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-indigo-800/50 rounded-lg transition-colors"
            >
              <Menu size={20} className="sm:w-6 sm:h-6 text-indigo-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Enhanced */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="text-xs sm:text-sm font-medium text-indigo-300 mb-2 sm:mb-3 flex items-center gap-2">
              <FolderTree size={14} className="sm:w-4 sm:h-4" />
              Select Document
            </div>
            <SearchableSelect
              options={documentOptions}
              value={selectedPdf}
              onChange={setSelectedPdf}
              placeholder="Select document..."
              loading={loadingDocs}
              error={connectionError}
              onDelete={deleteDocument}
            />
          </div>

          <div>
            <div className="text-xs sm:text-sm font-medium text-indigo-300 mb-2 sm:mb-3 flex items-center gap-2">
              <Upload size={14} className="sm:w-4 sm:h-4" />
              Upload PDF
            </div>
            <div className="relative">
              <label className={`flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                uploading ? 'opacity-75 cursor-not-allowed' : ''
              }`}>
                {uploading ? (
                  <>
                    <Loader size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" />
                    <span className="text-xs sm:text-sm font-medium">{uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium">Choose PDF</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {connectionError && (
            <button
              onClick={retryConnection}
              className="flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-red-900/30 text-red-200 rounded-lg sm:rounded-xl hover:bg-red-900/50 transition-all border border-red-700/50"
            >
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-medium">Retry Connection</span>
            </button>
          )}
        </div>
      </MobileMenu>

      {/* Main Chat Area - Mobile optimized */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full flex flex-col">
          {/* Quick Actions Bar - Mobile optimized */}
          {documents.length > 0 && selectedPdf && (
            <div className="flex-shrink-0 px-2 sm:px-4 lg:px-8 py-2 sm:py-3 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 backdrop-blur-sm border-b border-indigo-800/30 overflow-x-auto">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-max">
                <span className="text-[10px] sm:text-xs text-indigo-300 font-medium">Quick:</span>
                {quickActions.map((action, index) => (
                  <QuickActionButton
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onClick={action.action}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Messages - Mobile optimized */}
          <div 
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6 custom-scrollbar"
          >
            {messageState.map((msg) => (
              <Message 
                key={msg.id} 
                message={msg} 
                isStreaming={msg.id === streamingMessageId}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Scroll to Bottom Button - Mobile optimized */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-20 sm:bottom-24 right-2 sm:right-4 lg:right-8 bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-400 rounded-full p-2 sm:p-3 shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-110 animate-in fade-in slide-in-from-bottom-2 z-30"
            >
              <ChevronDown size={16} className="sm:w-5 sm:h-5 text-white" />
            </button>
          )}

          {/* Input Area - Mobile optimized */}
          <div className="flex-shrink-0 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 backdrop-blur-xl border-t border-indigo-800/50 p-2 sm:p-4 lg:p-6">
            <div className="px-1 sm:px-2 lg:px-8">
              <div className="flex items-end gap-1.5 sm:gap-2 lg:gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    placeholder={
                      documents.length === 0 
                        ? "✨ Upload a PDF..." 
                        : "💭 Ask about your document..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 pr-8 sm:pr-10 lg:pr-12 bg-indigo-950/50 border border-indigo-700/50 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all resize-none text-xs sm:text-sm lg:text-base text-white placeholder-indigo-300/50"
                    disabled={isSending || documents.length === 0}
                    rows={1}
                    style={{ minHeight: '36px', maxHeight: '80px' }}
                  />
                  
                  {/* Clear button */}
                  {input && (
                    <button
                      onClick={() => setInput("")}
                      className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 lg:right-4 lg:bottom-4 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>

                {/* Action Buttons - Mobile optimized */}
                <div className="flex gap-1 sm:gap-2">
                  {isSending ? (
                    <button
                      onClick={stopGeneration}
                      className="px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-95 flex items-center gap-1 sm:gap-2"
                    >
                      <StopCircle size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                      <span className="text-[10px] sm:text-xs font-medium hidden xs:inline">Stop</span>
                    </button>
                  ) : (
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || documents.length === 0}
                      className="px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg sm:rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all active:scale-95 flex items-center gap-1 sm:gap-2 group"
                    >
                      <Send size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] sm:text-xs font-medium hidden xs:inline">Send</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Bar - Mobile optimized */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-2 sm:mt-3 px-0.5 sm:px-1">
                {documents.length > 0 && selectedPdf && (
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-lg border border-emerald-700/50">
                    <div className="relative">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-emerald-200 font-medium truncate max-w-[120px] sm:max-w-[180px] lg:max-w-none">
                      {documents.find(d => d.document_id === selectedPdf)?.filename || 'Selected'}
                    </span>
                  </div>
                )}
                
                {documents.length === 0 && !loadingDocs && (
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-900/30 rounded-lg border border-amber-700/50">
                    <AlertCircle size={12} className="sm:w-3 sm:h-3 text-amber-400" />
                    <span className="text-[10px] sm:text-xs text-amber-200 font-medium">Upload a PDF</span>
                  </div>
                )}
                
                {loadingDocs && (
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-900/30 rounded-lg border border-indigo-700/50">
                    <Loader size={12} className="sm:w-3 sm:h-3 animate-spin text-indigo-400" />
                    <span className="text-[10px] sm:text-xs text-indigo-200 font-medium">Loading...</span>
                  </div>
                )}

                {deletingDocument && (
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-900/30 rounded-lg border border-red-700/50">
                    <Loader size={12} className="sm:w-3 sm:h-3 animate-spin text-red-400" />
                    <span className="text-[10px] sm:text-xs text-red-200 font-medium">Deleting...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-from-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-from-bottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-from-top {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes smooth-pulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.4; transform: scaleY(0.8); }
        }
        
        .animate-in {
          animation-duration: 0.4s;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fade-in;
        }
        
        .slide-in-from-right {
          animation-name: slide-in-from-right;
        }
        
        .slide-in-from-bottom {
          animation-name: slide-in-from-bottom;
        }
        
        .slide-in-from-top-2 {
          animation-name: slide-in-from-top;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-pulse-slow {
          animation: smooth-pulse 1.2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4f46e5 #1e1b4b;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1b4b;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }

        /* Hide text on very small screens */
        @media (max-width: 400px) {
          .hidden-xs {
            display: none;
          }
        }

        /* Prevent text selection during drag */
        .no-drag {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}