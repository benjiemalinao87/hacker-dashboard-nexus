import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WorkspaceData } from '@/types/workspace';

const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOlejPOC5tG0MRK1FAK";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mockTimeData = [
  { month: '1月', value: 40 },
  { month: '3月', value: 70 },
  { month: '5月', value: 45 },
  { month: '7月', value: 65 },
  { month: '9月', value: 35 },
  { month: '11月', value: 55 },
];

const mockDistributionData = [
  { name: '华北', value: 39 },
  { name: '华南', value: 28 },
  { name: '华东', value: 20 },
  { name: '西部', value: 13 },
];

const Index = () => {
  const [loading, setLoading] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<Record<string, WorkspaceData>>({});

  const fetchWorkspaceData = async (id: string) => {
    console.log('Fetching workspace data...', id);
    const { data: response, error } = await supabase.functions.invoke('workspace-proxy', {
      body: { workspaceId: id, token: AUTH_TOKEN }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('Received data:', response);
    
    if (response.data) {
      return {
        name: response.data.name,
        timezone: response.data.timezone || 'UTC',
        plan: response.data.plan,
        bot_user_used: response.data.bot_user_used,
        bot_user_limit: response.data.bot_user_limit,
        bot_used: response.data.bot_used,
        bot_limit: response.data.bot_limit,
        member_used: response.data.member_used,
        member_limit: response.data.member_limit,
        billing_start_at: response.data.billing_start_at,
        billing_end_at: response.data.billing_end_at
      };
    }
    throw new Error('Invalid response format');
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const workspaceIds = Object.keys(workspaces);
      const updatedWorkspaces: Record<string, WorkspaceData> = {};
      
      await Promise.all(
        workspaceIds.map(async (id) => {
          try {
            const data = await fetchWorkspaceData(id);
            updatedWorkspaces[id] = data;
          } catch (error) {
            console.error(`Error refreshing workspace ${id}:`, error);
            toast.error(`Failed to refresh workspace ${id}`);
          }
        })
      );
      
      setWorkspaces(updatedWorkspaces);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white p-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">智能看板</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50"
          >
            <RotateCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-blue-400">总设备数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2,190</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-green-400">季度新增</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">190</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-purple-400">运营设备</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3,001</p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-red-400">异常设备</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">108</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-blue-400">销售趋势</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTimeData}>
                  <XAxis dataKey="month" stroke="#4B5563" />
                  <YAxis stroke="#4B5563" />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-blue-400">区域分布</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-sm text-blue-400">全国用户总量统计</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { city: '上海', value: 2000 },
                  { city: '北京', value: 1800 },
                  { city: '合肥', value: 1600 },
                  { city: '杭州', value: 1400 },
                  { city: '济南', value: 1200 },
                  { city: '重庆', value: 1000 },
                ]}
              >
                <XAxis dataKey="city" stroke="#4B5563" />
                <YAxis stroke="#4B5563" />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;