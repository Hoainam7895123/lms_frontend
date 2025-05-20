<template>
  <div class="page-wrapper">
    <div class="container-xl">
      <!-- Tiêu đề trang -->
      <div class="page-header d-print-none">
        <div class="row align-items-center">
          <div class="col">
            <h2 class="page-title">Quản lý người dùng</h2>
            <div class="text-muted mt-1">
              Quản lý tất cả người dùng trong hệ thống
            </div>
          </div>
        </div>
      </div>

      <!-- Bộ lọc -->
      <div class="card mb-3">
        <div class="card-body">
          <div class="row g-3">
            <!-- Tìm kiếm theo tên hoặc email -->
            <div class="col-md-4">
              <label class="form-label">Tìm kiếm theo tên hoặc email</label>
              <input
                v-model="filters.search"
                type="text"
                class="form-control"
                placeholder="Nhập tên hoặc email"
                @input="debouncedFetchUsers"
              />
            </div>
            <!-- Lọc theo vai trò -->
            <div class="col-md-4">
              <label class="form-label">Vai trò</label>
              <select
                v-model="filters.role"
                class="form-select"
                @change="fetchUsers"
              >
                <option value="">Tất cả vai trò</option>
                <option value="ROLE_SYSTEM_ADMIN">Quản trị hệ thống</option>
                <option value="ROLE_CENTER_ADMIN">Quản trị trung tâm</option>
                <option value="ROLE_TEACHER">Giáo viên</option>
                <option value="ROLE_STUDENT">Học viên</option>
              </select>
            </div>
            <!-- Lọc theo trạng thái -->
            <div class="col-md-4">
              <label class="form-label">Trạng thái</label>
              <select
                v-model="filters.active"
                class="form-select"
                @change="fetchUsers"
              >
                <option value="">Tất cả</option>
                <option value="1">Kích hoạt</option>
                <option value="0">Không kích hoạt</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Bảng danh sách người dùng -->
      <div class="card">
        <div class="card-body">
          <!-- Trạng thái đang tải -->
          <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>

          <!-- Bảng -->
          <div v-else class="table-responsive">
            <table class="table table-vcenter card-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Lần đăng nhập cuối</th>
                </tr>
              </thead>
              <tbody>
                <!-- Trạng thái trống -->
                <tr v-if="!users">
                  <td colspan="6" class="text-center text-muted">
                    Không tìm thấy người dùng.
                  </td>
                </tr>
                <!-- Dòng người dùng -->
                <tr v-for="user in users" :key="user._id">
                  <td>{{ user.name || "N/A" }}</td>
                  <td>{{ user.username || "N/A" }}</td>
                  <td>{{ user.email || "N/A" }}</td>
                  <td>{{ formatRole(user.role) }}</td>
                  <td>
                    <span
                      :class="[
                        'badge',
                        user.active === 1 ? 'bg-success' : 'bg-danger',
                      ]"
                    >
                      {{ user.active === 1 ? "Kích hoạt" : "Không kích hoạt" }}
                    </span>
                  </td>
                  <td>
                    {{
                      user.last_login
                        ? formatDate(user.last_login)
                        : "Chưa từng"
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Phân trang -->
        <div class="card-footer d-flex align-items-center">
          <select
            v-model="pagination.limit"
            class="form-select w-auto me-3"
            @change="fetchUsers"
          >
            <option :value="10">10 mỗi trang</option>
            <option :value="20">20 mỗi trang</option>
            <option :value="50">50 mỗi trang</option>
          </select>
          <ul class="pagination m-0 ms-auto">
            <li class="page-item" :class="{ disabled: pagination.page === 1 }">
              <a
                class="page-link"
                href="#"
                @click.prevent="
                  pagination.page > 1 && changePage(pagination.page - 1)
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 6l-6 6l6 6" />
                </svg>
                Trước
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">
                Tiếp
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import debounce from "lodash/debounce";
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      total: 0,
      loading: false,
      filters: {
        search: "",
        role: "",
        active: "",
      },
      pagination: {
        page: 1,
        limit: 10,
      },
    };
  },
  computed: {
    // totalPages() {
    //   return Math.ceil(this.total / this.pagination.limit);
    // },
  },
  created() {
    this.debouncedFetchUsers = this.debounce(this.fetchUsers, 500);
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.filters.search,
          role: this.filters.role,
          active: this.filters.active,
        };

        console.log("params: ", params.search);
        const response = await axios.get("/api/users", { params });

        console.log("params: ", params);

        if (!response.data.error) {
          this.users = response.data.data.users;
          this.total = response.data.data.total;
          this.pagination.page = response.data.data.page;
          this.pagination.limit = response.data.data.limit;
        } else {
          this.users = [];
          this.total = 0;
        }
        console.log("users: ", this.users);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        this.users = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      this.pagination.page = page;
      this.fetchUsers();
    },
    formatRole(role) {
      return role
        .replace("ROLE_", "")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    debounce(func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
  },
};
</script>

<style scoped>
.table-responsive {
  min-height: 200px;
}
</style>
