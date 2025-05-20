<style>
body {
    background-color: #f8fafc;
}
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}
.card {
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
}
.table th,
.table td {
    vertical-align: middle;
}
.stats-card {
    text-align: center;
}
</style>

<template>
    <div class="page-wrapper">
        <div class="container-xl my-3">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Thông tin sinh viên</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Họ và tên:</strong> {{ student.name }}</p>
                            <p><strong>Mã sinh viên:</strong> 2021600735</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Lớp:</strong> 12A1</p>
                            <p><strong>Email:</strong> {{ student.email }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="card stats-card">
                        <div class="card-body">
                            <h4 class="card-title">Tổng bài tập</h4>
                            <h2>{{ submissions.length }}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card stats-card">
                        <div class="card-body">
                            <h4 class="card-title">Đã nộp</h4>
                            <h2>{{ submittedAssignments }}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card stats-card">
                        <div class="card-body">
                            <h4 class="card-title">Tỷ lệ nộp</h4>
                            <h2>{{ submissionRate }}%</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Danh sách bài tập</h3>
                </div>
                <div class="card-table table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Tên bài tập</th>
                                <th>Ngày nộp</th>
                                <th>Trạng thái</th>
                                <th>Điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="submission in submissions" :key="submission._id">
                                <td>{{ submission.title }}</td>
                                <td>{{ submission.dateOfSubmissions || 'Chưa nộp' }}</td>
                                <td>
                                    <span
                                        :class="{
                                            'badge bg-success': submission.status == 1,
                                            'badge bg-warning': submission.status == 0,
                                        }"
                                    >
                                        {{ submission.status }}
                                    </span>
                                </td>
                                <td>{{ submission.score || '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'StudentDetailPage',
    data() {
        return {
            studentId: '',
            student: '',
            submissions: [],
            submittedAssignments: '',
            submissionRate: '',
        };
    },
    methods: {
        async fetchStudent() {
            try {
                const response = await axios.get(`/api/users/${this.studentId}`);
                this.student = response.data.data;
            } catch (error) {
                console.log('Error');
            }
        },
        async fetchSubmissions() {
            try {
                const response = await axios.get(`/api/submissions/students/${this.studentId}`);
                this.submissions = response.data.data;
                this.submittedAssignments = this.submissions.filter(
                    submission => submission.status === true
                ).length;
                this.submissionRate = (this.submittedAssignments / this.submissions.length) * 100;
            } catch (error) {
                console.lof('Error');
            }
        },
    },
    created() {
        this.studentId = this.$route.params.studentId;
    },
    mounted() {
        this.fetchStudent();
        this.fetchSubmissions();
    },
};
</script>
