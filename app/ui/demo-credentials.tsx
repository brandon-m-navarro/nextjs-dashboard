"use client";
import { lusitana } from "../ui/fonts";
import { InformationCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { copyTextToClipboard } from "../../lib/utils";
import { useState } from "react";

export default function DemoCredentials() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  async function copyText(textToCopy: string, field: string) {
    await copyTextToClipboard(textToCopy);
    
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  }

  return (
    <div className={`mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg ${lusitana.className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-2 flex-1">
          <h4 className="text-sm font-medium text-blue-800">Demo Credentials</h4>
          <div className="mt-1 text-sm text-blue-700 space-y-2">
            {/* Email Row */}
            <div 
              onClick={() => copyText("test@test.com", "email")}
              className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-1 rounded transition-colors"
            >
              <div className="select-none">
                <strong className="select-none">Email: </strong>test@test.com
              </div>
              {copiedField === "email" && (
                <div className="flex items-center text-green-600 text-xs ml-2">
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Copied!
                </div>
              )}
            </div>

            {/* Password Row */}
            <div 
              onClick={() => copyText("123456", "password")}
              className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-1 rounded transition-colors"
            >
              <div className="select-none">
                <strong className="select-none">Password: </strong>123456
              </div>
              {copiedField === "password" && (
                <div className="flex items-center text-green-600 text-xs ml-2">
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}