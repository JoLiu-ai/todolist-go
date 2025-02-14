import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';

export default function MonthlyPlanPage() {
  // 生成当月日历数据
  const getDaysInMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    // 添加上个月的日期
    for (let i = 0; i < startingDay; i++) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      days.push({
        date: prevMonthLastDay - startingDay + i + 1,
        isCurrentMonth: false,
        hasPlans: false
      });
    }
    
    // 添加当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        hasPlans: Math.random() > 0.7 // 示例：随机显示一些计划
      });
    }
    
    // 添加下个月的日期
    const remainingDays = 42 - days.length; // 6行7列 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        hasPlans: false
      });
    }
    
    return days;
  };

  const days = getDaysInMonth();
  const currentMonth = new Date().toLocaleString('zh-CN', { month: 'long' });
  const currentYear = new Date().getFullYear();

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
                  <CalendarIcon className="h-5 w-5" />
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <span className="text-[#2c2c2c]">月度计划</span>
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
                    <CalendarIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                    <span className="relative">
                      月度计划
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4b483] opacity-30"></span>
                    </span>
                  </h2>
                  <Link
                    to="/plans/monthly/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    添加计划
                  </Link>
                </div>

                {/* 月历视图 */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-[#2c2c2c]">
                      {currentYear}年 {currentMonth}
                    </h3>
                    <div className="flex space-x-2">
                      <button className="p-2 text-[#8b7355] hover:text-[#d4b483] transition-colors">
                        上个月
                      </button>
                      <button className="p-2 text-[#8b7355] hover:text-[#d4b483] transition-colors">
                        下个月
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-px bg-[#e9dcc9] rounded-lg overflow-hidden">
                    {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                      <div key={day} className="bg-[#f7f3eb] p-4 text-center text-sm font-medium text-[#8b7355]">
                        {day}
                      </div>
                    ))}
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`bg-[#f7f3eb] hover:bg-[#e9dcc9] transition-colors p-4 min-h-[100px] ${
                          !day.isCurrentMonth ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-sm font-medium ${
                            day.isCurrentMonth ? 'text-[#2c2c2c]' : 'text-[#8b7355]'
                          }`}>
                            {day.date}
                          </span>
                          {day.hasPlans && (
                            <span className="w-2 h-2 rounded-full bg-[#d4b483]"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 月度目标 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#2c2c2c]">月度目标</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 示例目标卡片 */}
                    <div className="bg-[#f7f3eb] rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[#2c2c2c] font-medium">完成项目规划</h4>
                        <span className="text-xs text-[#8b7355]">进行中</span>
                      </div>
                      <p className="text-sm text-[#8b7355] mb-4">制定Q2季度项目计划和资源分配方案</p>
                      <div className="flex justify-between items-center text-xs text-[#8b7355]">
                        <span>进度: 40%</span>
                        <div className="flex items-center">
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
                            <div className="h-1.5 bg-[#d4b483] rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f7f3eb] rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[#2c2c2c] font-medium">技能提升</h4>
                        <span className="text-xs text-[#8b7355]">进行中</span>
                      </div>
                      <p className="text-sm text-[#8b7355] mb-4">完成React和TypeScript进阶课程学习</p>
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