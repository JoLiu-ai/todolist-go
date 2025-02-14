import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';

export default function DailyPlanPage() {
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
                  <ClockIcon className="h-5 w-5" />
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <span className="text-[#2c2c2c]">日计划</span>
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
                    <ClockIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                    <span className="relative">
                      日计划
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4b483] opacity-30"></span>
                    </span>
                  </h2>
                  <Link
                    to="/plans/daily/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    添加计划
                  </Link>
                </div>

                {/* 时间轴视图 */}
                <div className="mb-8">
                  <div className="space-y-4">
                    {Array.from({ length: 12 }).map((_, index) => {
                      const hour = index + 8; // 从早上8点开始
                      return (
                        <div key={hour} className="flex items-start">
                          <div className="w-16 text-sm text-[#8b7355] pt-2">
                            {`${hour.toString().padStart(2, '0')}:00`}
                          </div>
                          <div className="flex-1 ml-4">
                            <div className="bg-[#f7f3eb] rounded-lg p-4 hover:bg-[#e9dcc9] transition-colors min-h-[80px]">
                              {/* 示例计划项 */}
                              {hour === 9 && (
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-[#2c2c2c] font-medium">团队晨会</h4>
                                    <p className="text-sm text-[#8b7355] mt-1">讨论今日工作安排</p>
                                  </div>
                                  <span className="text-xs text-[#8b7355] bg-white px-2 py-1 rounded">30分钟</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 今日待办 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#2c2c2c]">今日待办</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 示例待办卡片 */}
                    <div className="bg-[#f7f3eb] rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[#2c2c2c] font-medium">完成报告</h4>
                        <span className="text-xs text-[#8b7355]">优先级高</span>
                      </div>
                      <p className="text-sm text-[#8b7355] mb-4">完成本周工作总结报告</p>
                      <div className="flex justify-between items-center text-xs text-[#8b7355]">
                        <span>截止时间: 17:00</span>
                        <span>未开始</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 今日统计 */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#f7f3eb] rounded-lg p-4">
                    <h4 className="text-sm text-[#8b7355] mb-2">计划完成</h4>
                    <p className="text-2xl font-medium text-[#2c2c2c]">3/5</p>
                  </div>
                  <div className="bg-[#f7f3eb] rounded-lg p-4">
                    <h4 className="text-sm text-[#8b7355] mb-2">工作时长</h4>
                    <p className="text-2xl font-medium text-[#2c2c2c]">4.5h</p>
                  </div>
                  <div className="bg-[#f7f3eb] rounded-lg p-4">
                    <h4 className="text-sm text-[#8b7355] mb-2">专注时间</h4>
                    <p className="text-2xl font-medium text-[#2c2c2c]">2.5h</p>
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