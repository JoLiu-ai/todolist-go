import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';

export default function WeeklyPlanPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
        {/* 面包屑导航 */}
        <nav className="mb-8 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-[#8b7355] hover:text-[#d4b483] flex items-center transition-colors">
                <HomeIcon className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <Link to="/plans" className="text-[#8b7355] hover:text-[#d4b483] flex items-center transition-colors">
                  <CalendarDaysIcon className="h-5 w-5" />
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <span className="text-[#2c2c2c]">周计划</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-[#e9dcc9] overflow-hidden">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#f7f3eb] rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#f7f3eb] rounded-full -z-10"></div>
              
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif text-[#2c2c2c] flex items-center">
                    <CalendarDaysIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                    <span className="relative">
                      周计划
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4b483] opacity-30"></span>
                    </span>
                  </h2>
                  <Link
                    to="/plans/weekly/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    添加计划
                  </Link>
                </div>

                {/* 周视图 */}
                <div className="mb-8">
                  <div className="grid grid-cols-7 gap-4">
                    {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map((day) => (
                      <div key={day} className="space-y-2">
                        <div className="text-center text-sm font-medium text-[#8b7355] bg-[#f7f3eb] rounded-lg py-2">
                          {day}
                        </div>
                        <div className="bg-[#f7f3eb] rounded-lg p-4 min-h-[200px] hover:bg-[#e9dcc9] transition-colors">
                          {/* 示例计划项 */}
                          <div className="text-sm text-[#8b7355] mb-2 cursor-pointer hover:text-[#d4b483]">
                            09:00 团队会议
                          </div>
                          <div className="text-sm text-[#8b7355] mb-2 cursor-pointer hover:text-[#d4b483]">
                            14:00 项目评审
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 本周目标 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#2c2c2c]">本周目标</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 示例目标卡片 */}
                    <div className="bg-[#f7f3eb] rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[#2c2c2c] font-medium">完成功能开发</h4>
                        <span className="text-xs text-[#8b7355]">进行中</span>
                      </div>
                      <p className="text-sm text-[#8b7355] mb-4">完成用户管理模块的核心功能开发</p>
                      <div className="flex justify-between items-center text-xs text-[#8b7355]">
                        <span>进度: 60%</span>
                        <div className="flex items-center">
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
                            <div className="h-1.5 bg-[#d4b483] rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 