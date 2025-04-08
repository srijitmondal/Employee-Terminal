import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarPicker from "react-native-calendar-picker";
import { format } from "date-fns";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryZoomContainer,
  createContainer,
} from "victory-native";

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

const { width } = Dimensions.get("window");

type DateRange = {
  startDate: Date;
  endDate: Date;
};

type RangeOption = "today" | "week" | "month" | "year";

type UserAttendance = {
  id: number;
  name: string;
  role: string;
  status: "active" | "inactive";
  daysPresent: number;
  daysAbsent: number;
  totalDays: number;
};

type ExpenseDetail = {
  id: number;
  userName: string;
  description: string;
  amount: number;
  date: string;
};

const UserAnalytics = () => {
  const router = useRouter();
  const [showAllActive, setShowAllActive] = useState(false);
  const [showAllInactive, setShowAllInactive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRange, setUserRange] = useState<RangeOption>("today");
  const [expenseRange, setExpenseRange] = useState<RangeOption>("today");
  const [userDateRange, setUserDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [expenseDateRange, setExpenseDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showUserStartPicker, setShowUserStartPicker] = useState(false);
  const [showUserEndPicker, setShowUserEndPicker] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userData, setUserData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [expenseData, setExpenseData] = useState({
    monthlyExpenses: { labels: [] as string[], data: [] },
    expenseCategories: { labels: [] as string[], data: [] },
    totalExpenses: 0,
  });

  const fetchAnalyticsData = useCallback(
    async (dataType: "users" | "expenses", dateRange: string) => {
      try {
        const response = await fetch(
          `http://demo-expense.geomaticxevs.in/ET-api/admin_analytics.php?dataType=${dataType}&range=${dateRange}`
        );
        const data = await response.json();
        if (dataType === "users") {
          setUserData(data);
        } else {
          setExpenseData(data);
        }
      } catch (error) {
        console.error(`Error fetching ${dataType} data:`, error);
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = () => {
      if (customDateRange.startDate && customDateRange.endDate) {
        const startDate = format(customDateRange.startDate, "yyyy-MM-dd");
        const endDate = format(customDateRange.endDate, "yyyy-MM-dd");
        fetchAnalyticsData("users", `custom&start=${startDate}&end=${endDate}`);
        fetchAnalyticsData(
          "expenses",
          `custom&start=${startDate}&end=${endDate}`
        );
      } else {
        fetchAnalyticsData("users", userRange);
        fetchAnalyticsData("expenses", expenseRange);
      }
    };

    fetchData();
  }, [userRange, expenseRange, customDateRange, fetchAnalyticsData]);

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);

      if (customDateRange.startDate && customDateRange.endDate) {
        const startDate = format(customDateRange.startDate, "yyyy-MM-dd");
        const endDate = format(customDateRange.endDate, "yyyy-MM-dd");
        await Promise.all([
          fetchAnalyticsData(
            "users",
            `custom&start=${startDate}&end=${endDate}`
          ),
          fetchAnalyticsData(
            "expenses",
            `custom&start=${startDate}&end=${endDate}`
          ),
        ]);
      } else {
        await Promise.all([
          fetchAnalyticsData("users", userRange),
          fetchAnalyticsData("expenses", expenseRange),
        ]);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [userRange, expenseRange, customDateRange, fetchAnalyticsData]);

  const pieChartData = [
    {
      name: "Active Users",
      population: userData.activeUsers,
      color: "#7c3aed",
      legendFontColor: "#64748b",
      legendFontSize: 12,
    },
    {
      name: "Inactive Users",
      population: userData.inactiveUsers,
      color: "#c4b5fd",
      legendFontColor: "#64748b",
      legendFontSize: 12,
    },
  ];

  const lineChartData = {
    labels: expenseData.monthlyExpenses.labels,
    datasets: [
      {
        data: expenseData.monthlyExpenses.data,
      },
    ],
  };

  const barChartData = {
    labels: expenseData.expenseCategories.labels,
    datasets: [
      {
        data: expenseData.expenseCategories.data,
      },
    ],
  };

  const handleUserRangeChange = (range: RangeOption) => {
    setUserRange(range);
    setCustomDateRange({ startDate: null, endDate: null });
  };

  const handleExpenseRangeChange = (range: RangeOption) => {
    setExpenseRange(range);
    setCustomDateRange({ startDate: null, endDate: null });
  };

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (
        !customDateRange.startDate ||
        (customDateRange.startDate && customDateRange.endDate)
      ) {
        const newStart = new Date(date);
        newStart.setHours(0, 0, 0, 0);
        setCustomDateRange({
          startDate: newStart,
          endDate: null,
        });
      } else if (customDateRange.startDate && !customDateRange.endDate) {
        const newEnd = new Date(date);
        newEnd.setHours(23, 59, 59, 999);

        if (newEnd >= customDateRange.startDate) {
          setCustomDateRange((prev) => ({
            ...prev,
            endDate: newEnd,
          }));
          setCalendarVisible(false);
        } else {
          setCustomDateRange({
            startDate: newEnd,
            endDate: customDateRange.startDate,
          });
          setCalendarVisible(false);
        }
      }
    },
    [customDateRange]
  );

  const handleUserDownload = () => {
    console.log("Downloading user analytics...");
  };

  const handleUserViewDetails = () => {
    router.push("/userattendance");
  };

  const handleExpenseDownload = () => {
    console.log("Downloading expense analytics...");
  };

  const handleExpenseViewDetails = () => {
    let dateRangeToPass;

    if (customDateRange.startDate && customDateRange.endDate) {
      dateRangeToPass = {
        type: "custom",
        startDate: customDateRange.startDate.toISOString(),
        endDate: customDateRange.endDate.toISOString(),
      };
    } else {
      dateRangeToPass = {
        type: expenseRange,
        startDate: null,
        endDate: null,
      };
    }

    router.push({
      pathname: "/allexpense",
      params: {
        dateRange: JSON.stringify(dateRangeToPass),
      },
    });
  };

  const DateRangeSelectorButton = () => (
    <TouchableOpacity
      style={styles.customDateButton}
      onPress={() => setCalendarVisible(true)}
    >
      <Text style={styles.customDateButtonText}>
        {customDateRange.startDate && customDateRange.endDate
          ? `${format(customDateRange.startDate, "MMM dd, yyyy")} - ${format(
              customDateRange.endDate,
              "MMM dd, yyyy"
            )}`
          : "Select Custom Date Range"}
      </Text>
    </TouchableOpacity>
  );

  const CalendarModal = () => (
    <Modal
      visible={isCalendarVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setCalendarVisible(false)}
    >
      <Pressable
        style={styles.modalBackdrop}
        onPress={() => setCalendarVisible(false)}
      >
        <View style={styles.calendarContent}>
          <View
            style={styles.calendarModal}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                {customDateRange.startDate && !customDateRange.endDate
                  ? `Selected start: ${format(
                      customDateRange.startDate,
                      "MMM dd, yyyy"
                    )}`
                  : customDateRange.startDate && customDateRange.endDate
                  ? `Selected range: ${format(
                      customDateRange.startDate,
                      "MMM dd"
                    )} - ${format(customDateRange.endDate, "MMM dd, yyyy")}`
                  : "Select start date"}
              </Text>
            </View>

            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              onDateChange={handleDateSelect}
              selectedStartDate={customDateRange.startDate || undefined}
              selectedEndDate={customDateRange.endDate || undefined}
              width={340}
              height={400}
              minDate={new Date(2000, 0, 1)}
              maxDate={new Date()}
              selectedDayColor="#3b82f6"
              selectedDayTextColor="#ffffff"
              todayBackgroundColor="#e6ffe6"
              textStyle={{
                fontSize: 16,
              }}
              dayLabelsWrapper={{
                borderBottomWidth: 0,
                paddingBottom: 10,
              }}
            />

            <View style={styles.calendarButtons}>
              <TouchableOpacity
                style={[styles.calendarButton, styles.clearButton]}
                onPress={() => {
                  setCustomDateRange({ startDate: null, endDate: null });
                }}
              >
                <Text style={styles.calendarButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.calendarButton, styles.cancelButton]}
                onPress={() => {
                  setCustomDateRange({ startDate: null, endDate: null });
                  setCalendarVisible(false);
                }}
              >
                <Text style={[styles.calendarButtonText, { color: "#ffffff" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  const ExpenseAnalyticsSection = () => {
    const maxDataPoints = 12;

    const adjustDataDensity = (data: any[], labels: string[]) => {
      if (data.length <= maxDataPoints) return { data, labels };

      const step = Math.ceil(data.length / maxDataPoints);
      return {
        data: data.filter((_, i) => i % step === 0),
        labels: labels.filter((_, i) => i % step === 0),
      };
    };

    const adjustedMonthlyData = adjustDataDensity(
      expenseData.monthlyExpenses.data,
      expenseData.monthlyExpenses.labels
    );

    return (
      <View style={styles.expenseSection}>
        <Text style={styles.title}>Expense Analytics</Text>

        <View style={styles.rangeContainer}>
          {(["today", "week", "month", "year"] as RangeOption[]).map(
            (range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.rangeButton,
                  expenseRange === range && styles.rangeButtonSelected,
                ]}
                onPress={() => handleExpenseRangeChange(range)}
              >
                <Text
                  style={[
                    styles.rangeButtonText,
                    expenseRange === range && styles.rangeButtonTextSelected,
                  ]}
                >
                  {range === "today"
                    ? "Today"
                    : range === "week"
                    ? "Last Week"
                    : range === "month"
                    ? "Last Month"
                    : "Last Year"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.customDateButton}
          onPress={() => setCalendarVisible(true)}
        >
          <Text style={styles.customDateButtonText}>
            {customDateRange.startDate && customDateRange.endDate
              ? `${format(
                  customDateRange.startDate,
                  "MMM dd, yyyy"
                )} - ${format(customDateRange.endDate, "MMM dd, yyyy")}`
              : "Select Custom Date Range"}
          </Text>
        </TouchableOpacity>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Company Expenses</Text>
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            padding={{ top: 50, bottom: 50, left: 60, right: 80 }}
            // containerComponent={
            //   <VictoryZoomVoronoiContainer
            //     labels={({ datum }) =>
            //       `₹${datum.y.toLocaleString()}\n${datum.x}`
            //     }
            //     labelComponent={
            //       <VictoryTooltip
            //         flyoutStyle={{
            //           stroke: '#7c3aed',
            //           fill: 'white',
            //         }}
            //         style={{ fontSize: 12 }}
            //       />
            //     }
            //     zoomDimension="x"
            //   />
            // }
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
              easing: "cubic",
            }}
          >
            <VictoryAxis
              tickFormat={(t, i) => {
                const label = adjustedMonthlyData.labels[i];
                return label?.length > 3 ? `${label.slice(0, 3)}...` : label;
              }}
              style={{
                tickLabels: { fontSize: 10, padding: 5 },
                grid: { stroke: "#e2e8f0" },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `₹${t / 1000}k`}
              style={{
                tickLabels: { fontSize: 10, padding: 5 },
                grid: { stroke: "#e2e8f0" },
              }}
            />
            <VictoryLine
              data={adjustedMonthlyData.data.map((y, index) => ({
                x: adjustedMonthlyData.labels[index],
                y,
              }))}
              style={{
                data: {
                  stroke: "#7c3aed",
                  strokeWidth: 3,
                },
              }}
            />
          </VictoryChart>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense Categories</Text>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={20}
            height={300}
            padding={{ top: 50, bottom: 60, left: 60, right: 80 }}
            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }) =>
                  `${datum.category}\n₹${datum.y.toLocaleString()}`
                }
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      stroke: "#7c3aed",
                      fill: "white",
                    }}
                    style={{ fontSize: 12 }}
                  />
                }
              />
            }
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
              easing: "bounce",
            }}
          >
            <VictoryAxis
              tickFormat={(t, i) => {
                const label = expenseData.expenseCategories.labels[i];
                return label?.length > 8 ? `${label.slice(0, 8)}...` : label;
              }}
              style={{
                tickLabels: {
                  fontSize: 10,
                  angle: -45,
                  textAnchor: "end",
                  padding: 5,
                },
                grid: { stroke: "transparent" },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `₹${t / 1000}k`}
              style={{
                tickLabels: { fontSize: 10, padding: 5 },
                grid: { stroke: "#e2e8f0" },
              }}
            />
            <VictoryBar
              data={expenseData.expenseCategories.data.map((y, index) => ({
                x: expenseData.expenseCategories.labels[index],
                y,
                category: expenseData.expenseCategories.labels[index],
              }))}
              style={{
                data: {
                  fill: "#7c3aed",
                  width: 20,
                },
              }}
              animate={{
                onEnter: {
                  duration: 500,
                  before: () => ({ y: 0 }),
                  after: (datum) => ({ y: datum.y }),
                },
              }}
            />
          </VictoryChart>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#7c3aed" }]}
            onPress={handleExpenseDownload}
          >
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#8b5cf6" }]}
            onPress={handleExpenseViewDetails}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.fixedRefreshButton}>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            size={24}
            color="#7c3aed"
            style={[
              styles.refreshIcon,
              isRefreshing && styles.refreshIconSpinning,
            ]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Attendance Analytics</Text>
          </View>

          <View style={styles.rangeContainer}>
            <TouchableOpacity
              style={[
                styles.rangeButton,
                userRange === "today" && styles.rangeButtonSelected,
              ]}
              onPress={() => handleUserRangeChange("today")}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  userRange === "today" && styles.rangeButtonTextSelected,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rangeButton,
                userRange === "week" && styles.rangeButtonSelected,
              ]}
              onPress={() => handleUserRangeChange("week")}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  userRange === "week" && styles.rangeButtonTextSelected,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rangeButton,
                userRange === "month" && styles.rangeButtonSelected,
              ]}
              onPress={() => handleUserRangeChange("month")}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  userRange === "month" && styles.rangeButtonTextSelected,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rangeButton,
                userRange === "year" && styles.rangeButtonSelected,
              ]}
              onPress={() => handleUserRangeChange("year")}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  userRange === "year" && styles.rangeButtonTextSelected,
                ]}
              >
                Year
              </Text>
            </TouchableOpacity>
          </View>

          <DateRangeSelectorButton />

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>User Activity</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={pieChartData}
                width={width - 32}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                center={[10, 0]}
              />
            </View>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#7c3aed" }]}
                />
                <Text style={styles.legendText}>
                  Active Users ({userData.activeUsers})
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#c4b5fd" }]}
                />
                <Text style={styles.legendText}>
                  Inactive Users ({userData.inactiveUsers})
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#7c3aed" }]}
              onPress={handleUserDownload}
            >
              <Text style={styles.actionButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#8b5cf6" }]}
              onPress={handleUserViewDetails}
            >
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ExpenseAnalyticsSection />

        {showUserDetails && (
          <View style={styles.detailsContainer}>
            <Text>User Details View Placeholder</Text>
            <TouchableOpacity onPress={() => setShowUserDetails(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {showExpenseDetails && (
          <Modal
            visible={showExpenseDetails}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowExpenseDetails(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Expense Details</Text>
                <TouchableOpacity onPress={() => setShowExpenseDetails(false)}>
                  <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {showUserStartPicker && (
          <DateTimePicker
            value={userDateRange.startDate}
            mode="date"
            onChange={(event, date) => {
              setShowUserStartPicker(false);
              if (date) {
                setUserDateRange((prev) => ({ ...prev, startDate: date }));
              }
            }}
          />
        )}
        {showUserEndPicker && (
          <DateTimePicker
            value={userDateRange.endDate}
            mode="date"
            onChange={(event, date) => {
              setShowUserEndPicker(false);
              if (date) {
                setUserDateRange((prev) => ({ ...prev, endDate: date }));
              }
            }}
          />
        )}

        {isCalendarVisible && <CalendarModal />}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  fixedRefreshButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1000,
    marginRight: 20,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
  },
  refreshIcon: {
    opacity: 1,
  },
  refreshIconSpinning: {
    opacity: 0.5,
    transform: [{ rotate: "180deg" }],
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    margin: 6,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#0f172a",
  },
  usersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  userListContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userListTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  userList: {
    maxHeight: 300,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  userRole: {
    fontSize: 14,
    color: "#64748b",
  },
  userLastActive: {
    fontSize: 12,
    color: "#94a3b8",
  },
  viewAllButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  viewAllButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  fullListContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    zIndex: 1000,
    padding: 16,
  },
  fullListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  fullListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  closeButton: {
    fontSize: 24,
    color: "#64748b",
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#0f172a",
  },
  noResultsText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 16,
    marginTop: 24,
  },
  expenseSection: {
    padding: 16,
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  rangeContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 4,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  rangeButtonSelected: {
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  rangeButtonText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  rangeButtonTextSelected: {
    color: "#0f172a",
    fontWeight: "600",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "500",
  },
  dateRangeSeparator: {
    marginHorizontal: 12,
    color: "#64748b",
  },
  pieChartContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  detailsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    zIndex: 1000,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  dateRangeText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  usersList: {
    padding: 16,
  },
  attendanceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  userInfoSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  attendanceStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  statItem: {
    alignItems: "center",
  },
  absentValue: {
    color: "#dc2626",
  },
  fixedSearchContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsSearchInput: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#0f172a",
  },
  expenseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expenseInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expenseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
    marginHorizontal: 12,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  expensesList: {
    padding: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  selectionInfo: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  selectionText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  calendarButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  calendarButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelButton: {
    backgroundColor: "#3b82f6",
  },
  calendarButtonText: {
    fontSize: 14,
  },
  customDateButton: {
    backgroundColor: "#f1f5f9",
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  customDateButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default UserAnalytics;
